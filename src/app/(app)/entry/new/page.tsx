import NewEntryForm from "@/components/journal/new-entry-form";

export default function NewEntryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">New Journal Entry</h1>
        <p className="text-muted-foreground">Capture your thoughts, moments, and feelings.</p>
      </div>
      <NewEntryForm />
    </div>
  );
}
