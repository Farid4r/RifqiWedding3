import './thank-you-section.css'

export default function ThankYouSection() {
  return (
    <section className="thank-you" aria-labelledby="thank-you-title">
      <div className="thank-you__inner">
        <p className="thank-you__monogram" aria-label="Rifqi dan Natashya">R <span aria-hidden="true">·</span> N</p>
        <h2 id="thank-you-title">Terima Kasih</h2>
        <p className="thank-you__message">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Anda berkenan hadir serta memberikan doa restu bagi perjalanan baru kami.
        </p>
        <p className="thank-you__couple">Rifqi <span aria-hidden="true">&amp;</span> Natashya</p>
      </div>
    </section>
  )
}
