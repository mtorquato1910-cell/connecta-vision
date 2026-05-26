import { serializeSchema } from "@/lib/schema-org";

/** Injeta um JSON-LD no DOM da página (próximo a body, válido para SEO). */
export function SchemaOrg({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeSchema(schema) }}
    />
  );
}
