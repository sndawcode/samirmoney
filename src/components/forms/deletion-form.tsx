"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type BaseSyntheticEvent } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { submitDeletion } from "@/app/suppression-de-compte/actions";
import { contactForm } from "@/content/fr/contact";
import { accountDeletion } from "@/content/fr/legal";
import { cx } from "@/lib/cx";
import { deletionSchema, type DeletionInput, type DeletionRequest } from "@/lib/deletion-schema";
import type { FormResult } from "@/lib/form-result";
import { frTypo } from "@/lib/fr-typography";
import { buttonVariants } from "@/components/ui/button-variants";
import { Field, fieldClasses, FormError } from "@/components/forms/field";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const copy = accountDeletion.form;
const DEFAULTS: DefaultValues<DeletionInput> = { firstName: "", lastName: "", phone: "+221 " };

/** Account deletion request — reachable without login (app-store requirement, §9.9). */
export function DeletionForm() {
  const [result, setResult] = useState<FormResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [token, setToken] = useState<string>();
  const statusRef = useRef<HTMLDivElement>(null);

  // Move focus to the outcome (error summary or confirmation) after each submit attempt.
  useEffect(() => {
    if (result) statusRef.current?.focus();
  }, [result]);
  const { register, handleSubmit, setError, formState } = useForm<
    DeletionInput,
    unknown,
    DeletionRequest
  >({
    resolver: zodResolver(deletionSchema),
    defaultValues: DEFAULTS,
    mode: "onTouched",
  });
  const { errors } = formState;

  function onValid(values: DeletionRequest, event?: BaseSyntheticEvent) {
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const honeypot = form ? String(new FormData(form).get("website") ?? "") : "";
    startTransition(async () => {
      const response = await submitDeletion({ values, turnstileToken: token, honeypot });
      setResult(response);
      if (response.status === "error") {
        for (const [field, message] of Object.entries(response.fieldErrors ?? {})) {
          setError(field as keyof DeletionInput, { message });
        }
      }
    });
  }

  function onInvalid() {
    setResult({ status: "error", message: contactForm.errors.summary });
  }

  if (result?.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-lg bg-samir-50 p-8 outline-none"
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-samir-700" strokeWidth={1.5} />
        <p className="text-lead text-ink-950">{frTypo(copy.success)}</p>
      </div>
    );
  }

  const describedBy = (name: keyof DeletionInput, hint = false) =>
    [hint && `${name}-hint`, errors[name] && `${name}-error`].filter(Boolean).join(" ") ||
    undefined;

  return (
    <form noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="flex flex-col gap-6">
      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {result?.status === "error" && <FormError>{result.message}</FormError>}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="firstName" label={copy.firstName} error={errors.firstName?.message}>
          <input
            id="firstName"
            autoComplete="given-name"
            {...register("firstName")}
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={describedBy("firstName")}
            className={fieldClasses}
          />
        </Field>
        <Field id="lastName" label={copy.lastName} error={errors.lastName?.message}>
          <input
            id="lastName"
            autoComplete="family-name"
            {...register("lastName")}
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={describedBy("lastName")}
            className={fieldClasses}
          />
        </Field>
      </div>
      <Field id="phone" label={copy.phone} hint={copy.phoneHint} error={errors.phone?.message}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          {...register("phone")}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy("phone", true)}
          className={fieldClasses}
        />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">{contactForm.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("confirm")}
            aria-invalid={errors.confirm ? true : undefined}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-samir-700"
          />
          <span>{frTypo(copy.confirm)}</span>
        </label>
        {errors.confirm?.message && (
          <p id="confirm-error" className="text-sm font-medium text-danger-strong">
            {frTypo(errors.confirm.message)}
          </p>
        )}
      </div>
      {TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={setToken}
          onExpire={() => setToken(undefined)}
          options={{ language: "fr" }}
        />
      )}
      <button
        type="submit"
        disabled={pending}
        className={cx(buttonVariants({ variant: "primary" }), "self-start")}
      >
        {pending ? contactForm.submitting : copy.submit}
      </button>
    </form>
  );
}
