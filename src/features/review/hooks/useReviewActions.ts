import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/toast/toastContext'
import type { CandidateDetail, Criterion, Verdict } from '@/types'
import { deleteDecision, postFinalize, postRescreen, putDecision, putFlag } from '../api'
import { applyClearDecision, applyDecision, applyFlag } from '../optimistic'
import { verdictLabel } from '../verdict'

interface DecisionInput {
  criterionId: string
  verdict: Verdict
  reason?: string
}

interface FlagInput {
  criterionId: string
  flagged: boolean
  note?: string
}

interface Context {
  previous?: CandidateDetail
}

export function useReviewActions(id: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const key = ['candidate', id]
  const mutationKey = ['review', id]

  function settle() {
    // Only refetch once the last in-flight change finishes, so a refetch
    // never overwrites another change that is still being saved.
    if (queryClient.isMutating({ mutationKey }) <= 1) {
      void queryClient.invalidateQueries({ queryKey: key })
    }
    void queryClient.invalidateQueries({ queryKey: ['candidates'] })
  }

  async function snapshotAndApply(
    apply: (c: CandidateDetail) => CandidateDetail,
  ): Promise<Context> {
    await queryClient.cancelQueries({ queryKey: key })
    const previous = queryClient.getQueryData<CandidateDetail>(key)
    if (previous) queryClient.setQueryData(key, apply(previous))
    return { previous }
  }

  function rollback(error: Error, context?: Context) {
    if (context?.previous) queryClient.setQueryData(key, context.previous)
    toast({ message: error.message, tone: 'error' })
  }

  const decision = useMutation<CandidateDetail, Error, DecisionInput, Context>({
    mutationKey,
    mutationFn: ({ criterionId, verdict, reason }) => putDecision(id, criterionId, verdict, reason),
    onMutate: (input) =>
      snapshotAndApply((c) => applyDecision(c, input.criterionId, input.verdict, input.reason)),
    onError: (error, _input, context) => rollback(error, context),
    onSettled: settle,
  })

  const clear = useMutation<CandidateDetail, Error, string, Context>({
    mutationKey,
    mutationFn: (criterionId) => deleteDecision(id, criterionId),
    onMutate: (criterionId) => snapshotAndApply((c) => applyClearDecision(c, criterionId)),
    onError: (error, _input, context) => rollback(error, context),
    onSettled: settle,
  })

  const flag = useMutation<CandidateDetail, Error, FlagInput, Context>({
    mutationKey,
    mutationFn: ({ criterionId, flagged, note }) => putFlag(id, criterionId, flagged, note),
    onMutate: (input) =>
      snapshotAndApply((c) => applyFlag(c, input.criterionId, input.flagged, input.note)),
    onError: (error, _input, context) => rollback(error, context),
    onSettled: settle,
  })

  const rescreen = useMutation<CandidateDetail, Error, void>({
    mutationKey,
    mutationFn: () => postRescreen(id),
    onSuccess: (data) => {
      queryClient.setQueryData(key, data)
      toast({ message: 'AI screening re-run. Your decisions were kept.' })
    },
    onError: (error) => toast({ message: error.message, tone: 'error' }),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ['candidates'] }),
  })

  const finalize = useMutation<CandidateDetail, Error, void>({
    mutationKey,
    mutationFn: () => postFinalize(id),
    onSuccess: (data) => {
      queryClient.setQueryData(key, data)
      toast({ message: 'Eligibility finalized.' })
    },
    onError: (error) => toast({ message: error.message, tone: 'error' }),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ['candidates'] }),
  })

  return {
    decide(criterion: Criterion, verdict: Verdict, reason?: string) {
      decision.mutate({ criterionId: criterion.id, verdict, reason })
      toast({
        message: `Saved: ${verdictLabel(criterion.type, verdict)}`,
        actionLabel: 'Undo',
        onAction: () => clear.mutate(criterion.id),
        durationMs: 5000,
      })
    },
    undo: (criterionId: string) => clear.mutate(criterionId),
    setFlag(criterionId: string, flagged: boolean, note?: string) {
      flag.mutate({ criterionId, flagged, note })
      toast({ message: flagged ? 'Sent to the investigator.' : 'Flag withdrawn.' })
    },
    rescreen: () => rescreen.mutate(),
    finalize: () => finalize.mutate(),
    isRescreening: rescreen.isPending,
    isFinalizing: finalize.isPending,
  }
}
