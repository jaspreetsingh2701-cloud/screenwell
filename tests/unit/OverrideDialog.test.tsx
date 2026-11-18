import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OverrideDialog } from '@/features/review/components/OverrideDialog'
import { makeAi, makeCriterion } from '../factories'

function renderDialog() {
  const onClose = vi.fn()
  const onSubmit = vi.fn()
  render(
    <OverrideDialog
      criterion={makeCriterion({ ai: makeAi('pass', 0.74) })}
      initialVerdict="fail"
      onClose={onClose}
      onSubmit={onSubmit}
    />,
  )
  return { onClose, onSubmit, user: userEvent.setup() }
}

describe('OverrideDialog', () => {
  it('opens as a dialog with the chosen answer pre-selected', () => {
    renderDialog()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Not met' })).toBeChecked()
  })

  it('requires a reason before saving', async () => {
    const { onSubmit, user } = renderDialog()
    await user.click(screen.getByRole('button', { name: 'Save answer' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Please add a reason or source.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the answer and the trimmed reason', async () => {
    const { onSubmit, user } = renderDialog()
    await user.type(screen.getByLabelText(/reason or source/i), 'Clinic note records ECOG 2. ')
    await user.click(screen.getByRole('button', { name: 'Save answer' }))
    expect(onSubmit).toHaveBeenCalledWith('fail', 'Clinic note records ECOG 2.')
  })

  it('closes without saving when cancelled', async () => {
    const { onClose, onSubmit, user } = renderDialog()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
