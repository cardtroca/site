/** Port de _NotesSection. */
export function NotesCard({ notes }: { notes: string }) {
  return (
    <section className="app-card lp-block lp-notes">
      <div className="lp-notes-cap">Observações do vendedor</div>
      <p>{notes}</p>
    </section>
  );
}
