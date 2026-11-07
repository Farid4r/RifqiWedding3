import { useState } from 'react'
import { AlertCircle, Check, Copy } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'

export default function GiftAccountCard({ account }) {
  const [copyStatus, setCopyStatus] = useState('')
  const hasAccountNumber =
    typeof account.accountNumber === 'string' && account.accountNumber.trim().length > 0

  async function handleCopy() {
    if (!hasAccountNumber) return

    if (!navigator.clipboard?.writeText) {
      setCopyStatus('Fitur salin tidak tersedia. Pilih nomor rekening untuk menyalinnya secara manual.')
      return
    }

    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopyStatus('Nomor rekening berhasil disalin.')
    } catch {
      setCopyStatus('Nomor rekening belum dapat disalin. Pilih nomor di atas untuk menyalinnya secara manual.')
    }
  }

  return (
    <article className="gift-account" aria-labelledby={`gift-account-${account.id}`}>
      <p className="gift-account__bank">{account.bank}</p>
      <h3 className="gift-account__holder" id={`gift-account-${account.id}`}>
        {account.accountHolder}
      </h3>

      {hasAccountNumber ? (
        <p className="gift-account__number">{account.accountNumber}</p>
      ) : (
        <p className="gift-account__pending">
          Informasi rekening akan dilengkapi oleh pemilik proyek.
        </p>
      )}

      {hasAccountNumber && (
        <Button
          className="gift-account__copy"
          variant="secondary"
          onClick={handleCopy}
          aria-label={`Salin nomor rekening ${account.bank}`}
        >
          <Copy size={16} aria-hidden="true" />
          <span>Salin nomor</span>
        </Button>
      )}

      <p className="gift-account__feedback" role="status" aria-live="polite">
        {copyStatus && (
          <>
            {copyStatus.startsWith('Nomor rekening berhasil') ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <AlertCircle size={15} aria-hidden="true" />
            )}
            <span>{copyStatus}</span>
          </>
        )}
      </p>
    </article>
  )
}
