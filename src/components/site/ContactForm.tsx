import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { useLocale, useT } from "@/i18n/use-locale";
import { Arrow, btnPrimary } from "./ui-bits";
import { Button } from "@/components/ui/button";

type Fields = { name: string; email: string; phone: string; message: string };
type Status = "idle" | "sending" | "success" | "error";

export function validateContact(f: Fields) {
  const e: Partial<Record<keyof Fields, "required" | "email">> = {};
  if (!f.name.trim()) e.name = "required";
  if (!f.email.trim()) e.email = "required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "email";
  if (!f.message.trim()) e.message = "required";
  return e;
}

export function ContactForm() {
  const t = useT();
  const locale = useLocale();
  const [f, setF] = useState<Fields>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [status, setStatus] = useState<Status>("idle");
  const endpoint = siteConfig.contactEndpoint;

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!endpoint) return;
    const e = validateContact(f);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, locale }) });
      if (!res.ok) throw new Error();
      setStatus("success");
      setF({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const field = (key: keyof Fields, label: string, type = "text", required = true) => {
    const err = errors[key];
    const id = `cf-${key}`;
    const common = {
      id, name: key, value: f[key], required,
      "aria-invalid": !!err || undefined,
      "aria-describedby": err ? `${id}-err` : undefined,
      onChange: (e: { target: { value: string } }) => setF((p) => ({ ...p, [key]: e.target.value })),
      className: "w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary",
    };
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-bold text-deep">{label}</label>
        {key === "message" ? <textarea rows={4} {...common} /> : <input type={type} autoComplete={key === "name" ? "name" : key === "email" ? "email" : "tel"} {...common} />}
        {err && <p id={`${id}-err`} className="text-sm text-destructive">{err === "email" ? t.ui.invalidEmail : t.ui.required}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
      {field("name", t.form.name)}
      {field("email", t.form.email, "email")}
      {field("phone", t.form.phone, "tel", false)}
      {field("message", t.form.message)}
      <Button type="submit" disabled={!endpoint || status === "sending"} aria-disabled={!endpoint || status === "sending"} className={`${btnPrimary} mt-2 h-auto w-full whitespace-normal disabled:cursor-not-allowed disabled:opacity-60`}>
        {status === "sending" ? t.ui.sending : t.form.submit} <Arrow />
      </Button>
      <p role="status" aria-live="polite" className="text-sm">
        {status === "success" && <span className="text-primary">{t.ui.success}</span>}
        {status === "error" && <span className="text-destructive">{t.ui.failure}</span>}
      </p>
    </form>
  );
}
