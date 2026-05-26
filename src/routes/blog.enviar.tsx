import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { submitPost } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/enviar")({
  head: () => ({
    meta: [
      { title: "Enviar artigo — Blog Conecta" },
      {
        name: "description",
        content:
          "Compartilhe sua experiência técnica com a comunidade veterinária. Sua submissão passa por aprovação editorial.",
      },
    ],
  }),
  component: SubmitPage,
});

const schema = z.object({
  autor_nome: z.string().min(3, "Informe seu nome completo"),
  autor_email: z.string().email("E-mail inválido"),
  titulo: z.string().min(10, "Título precisa ter pelo menos 10 caracteres"),
  resumo: z.string().min(30, "Resumo de no mínimo 30 caracteres"),
  conteudo: z.string().min(200, "Texto de no mínimo 200 caracteres"),
  tags: z.string().optional(),
  capa_url: z.string().url("URL inválida").optional().or(z.literal("")),
  video_url: z.string().url("URL inválida").optional().or(z.literal("")),
  honeypot: z.string().max(0, "spam"),
  consent: z.literal(true, { message: "Necessário concordar" }),
});

type FormData = z.infer<typeof schema>;

function SubmitPage() {
  const [sent, setSent] = useState(false);
  const [openedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Anti-bot: rejeita se enviado em menos de 3s
    if (Date.now() - openedAt < 3000) return;

    const tags = (data.tags ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    submitPost({
      titulo: data.titulo,
      resumo: data.resumo,
      conteudo: data.conteudo,
      capa_url: data.capa_url || undefined,
      video_url: data.video_url || undefined,
      autor_nome: data.autor_nome,
      autor_email: data.autor_email,
      tags,
    });
    setSent(true);
    reset();
  };

  if (sent) {
    return (
      <SiteShell>
        <section className="container-edge py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-conecta-orange/15 text-conecta-orange flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-serif text-4xl md:text-5xl text-ink leading-tight">
              Recebemos seu artigo.
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Vamos revisar editorialmente e publicar em breve. Você receberá um
              email quando estiver no ar. Obrigado por contribuir!
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/blog" className="btn-primary">
                Voltar ao blog
              </Link>
              <button onClick={() => setSent(false)} className="btn-ghost">
                Enviar outro
              </button>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container-edge pt-16 md:pt-24 pb-24">
        <Reveal>
          <span className="eyebrow">Envie seu artigo</span>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl text-ink leading-[1.05] max-w-3xl">
            Compartilhe sua experiência técnica.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Toda submissão passa pelo nosso processo editorial. Aprovamos
            artigos com valor técnico para a comunidade veterinária.
          </p>
        </Reveal>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 max-w-3xl space-y-6"
          noValidate
        >
          {/* honeypot invisível */}
          <input
            {...register("honeypot")}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <Grid>
            <Field label="Seu nome completo" error={errors.autor_nome?.message}>
              <input
                {...register("autor_nome")}
                className="input"
                placeholder="Ex.: Dra. Mariana Silva"
              />
            </Field>
            <Field label="Seu e-mail" error={errors.autor_email?.message}>
              <input
                {...register("autor_email")}
                type="email"
                className="input"
                placeholder="voce@clinica.com.br"
              />
            </Field>
          </Grid>

          <Field label="Título do artigo" error={errors.titulo?.message}>
            <input
              {...register("titulo")}
              className="input"
              placeholder="Ex.: Protocolos de monitorização em felinos braquicefálicos"
            />
          </Field>

          <Field label="Resumo (1 a 3 frases)" error={errors.resumo?.message}>
            <textarea
              {...register("resumo")}
              rows={2}
              className="input min-h-[80px] resize-y"
              placeholder="Em uma frase: qual problema seu artigo resolve?"
            />
          </Field>

          <Field
            label="Texto completo"
            error={errors.conteudo?.message}
            hint="Use ## para subtítulos e - para listas. Mínimo 200 caracteres."
          >
            <textarea
              {...register("conteudo")}
              rows={14}
              className="input min-h-[300px] resize-y font-mono text-sm leading-relaxed"
              placeholder={`## Introdução\n\nEscreva aqui o texto principal do seu artigo.\n\n## Conclusão\n\nFinalize com pontos práticos.`}
            />
          </Field>

          <Grid>
            <Field label="Tags (separe por vírgula)" hint="Opcional">
              <input
                {...register("tags")}
                className="input"
                placeholder="anestesia, felinos, monitorização"
              />
            </Field>
            <Field
              label="URL da capa (imagem)"
              hint="Opcional. Se vazio usaremos uma padrão."
              error={errors.capa_url?.message}
            >
              <input
                {...register("capa_url")}
                className="input"
                placeholder="https://..."
              />
            </Field>
          </Grid>

          <Field
            label="URL do vídeo YouTube"
            hint="Opcional. Cole o link do YouTube — se preenchido, o post abre com o vídeo em vez da imagem."
            error={errors.video_url?.message}
          >
            <input
              {...register("video_url")}
              className="input"
              placeholder="https://youtu.be/..."
            />
          </Field>

          <label className="flex items-start gap-3 text-sm text-ink-soft">
            <input
              {...register("consent")}
              type="checkbox"
              className="mt-1 h-4 w-4 accent-conecta-orange"
            />
            <span>
              Concordo que meu artigo possa ser publicado no blog da Conecta após
              revisão editorial. Aceito a{" "}
              <a href="#" className="underline">
                política de privacidade
              </a>
              .
            </span>
          </label>
          {errors.consent && (
            <p className="text-sm text-red-600">{errors.consent.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-base"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Enviando..." : "Enviar para aprovação"}
          </button>
        </form>
      </section>
    </SiteShell>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-6">{children}</div>;
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      {children}
      {hint && !error && <p className="input-helper">{hint}</p>}
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}
