import { useEffect, useState } from "react";
import { X, Send, MessageCircle, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { SITE, waLink, type Produto } from "@/lib/site-data";
import { submitFormulario } from "@/lib/admin.functions";

type FormData = {
  nome: string;
  clinica: string;
  email: string;
  telefone: string;
  cidade: string;
  mensagem: string;
};

export function QuoteModal({
  produto,
  open,
  onClose,
}: {
  produto: Produto;
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const [sent, setSent] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    setErro(null);
    try {
      await submitFormulario({
        data: {
          tipo: "orcamento_produto",
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || null,
          empresa: data.clinica || null,
          cidade: data.cidade.split("/")[0]?.trim() ?? null,
          mensagem: data.mensagem || `Solicito orçamento do ${produto.modelo}.`,
          origem: `/produtos/${produto.slug}`,
          payload: {
            estado: data.cidade.split("/")[1]?.trim() ?? null,
            nome_estabelecimento: data.clinica,
            tipo_estabelecimento: "Clínica veterinária",
            produto_id: produto.slug,
            produto_modelo: produto.modelo,
            produto_nome: produto.nome,
          },
        },
      });

      setSent(true);
      reset();
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível enviar. Tente novamente ou use o WhatsApp.",
      );
    }
  };

  const waMsg = `Olá! Tenho interesse no ${produto.modelo} — ${produto.nome}. Pode me enviar um orçamento?`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-paper rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-10 w-10 rounded-full border border-line-strong flex items-center justify-center hover:bg-bone z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8 md:p-10 border-b border-line">
          <span className="eyebrow">Solicitar orçamento</span>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-ink leading-tight">
            {produto.modelo}
          </h2>
          <p className="mt-1 text-ink-soft">{produto.nome}</p>
        </div>

        {sent ? (
          <div className="p-8 sm:p-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-conecta-orange/15 flex items-center justify-center">
              <Check className="h-7 w-7 text-conecta-orange" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-ink">Pedido recebido</h3>
            <p className="mt-2 text-ink-soft">
              Nossa equipe comercial entra em contato em até 1 dia útil pelos canais
              informados.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink(waMsg)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp agora
              </a>
              <button onClick={onClose} className="btn-ghost">
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 md:p-10 grid md:grid-cols-2 gap-4"
          >
            <Field label="Nome" error={errors.nome?.message}>
              <input
                {...register("nome", { required: "Obrigatório" })}
                className="input"
              />
            </Field>
            <Field label="Clínica / Hospital" error={errors.clinica?.message}>
              <input
                {...register("clinica", { required: "Obrigatório" })}
                className="input"
              />
            </Field>
            <Field label="E-mail" error={errors.email?.message}>
              <input
                type="email"
                {...register("email", { required: "Obrigatório" })}
                className="input"
              />
            </Field>
            <Field label="Telefone / WhatsApp" error={errors.telefone?.message}>
              <input
                {...register("telefone", { required: "Obrigatório" })}
                className="input"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Cidade / UF" error={errors.cidade?.message}>
                <input
                  {...register("cidade", { required: "Obrigatório" })}
                  className="input"
                  placeholder="Belo Horizonte / MG"
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Mensagem (opcional)">
                <textarea
                  rows={4}
                  {...register("mensagem")}
                  className="input resize-none"
                  placeholder="Conte-nos sobre seu projeto, prazo de implantação, quantidade etc."
                />
              </Field>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-60"
              >
                <Send className="h-4 w-4" />{" "}
                {isSubmitting ? "Enviando..." : "Enviar pedido"}
              </button>
              <a
                href={waLink(waMsg)}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <MessageCircle className="h-4 w-4" /> Prefiro WhatsApp
              </a>
            </div>
            {erro && (
              <p className="md:col-span-2 text-sm text-red-600">{erro}</p>
            )}
            <p className="md:col-span-2 text-xs text-ink-soft">
              Sua mensagem chega ao admin da Conecta. Atendimento em até 1 dia útil. {SITE.email}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-[0.16em] text-ink-soft mb-2">
        {label}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-600">{error}</span>}
    </label>
  );
}
