"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type BaseSyntheticEvent,
} from "react";
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
  type FieldErrors,
} from "react-hook-form";
import { submitContact } from "@/app/contact/actions";
import {
  contactForm as copy,
  profilLabels,
  profils,
  sujetLabels,
  sujets,
  sujetsByProfil,
} from "@/content/fr/contact";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import {
  contactSchema,
  parsePrefill,
  type ContactInput,
  type ContactRequest,
} from "@/lib/contact-schema";
import type { FormResult } from "@/lib/form-result";
import { frTypo } from "@/lib/fr-typography";
import { buttonVariants } from "@/components/ui/button-variants";
import { Field, fieldClasses, FormError } from "@/components/forms/field";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const EMPTY: DefaultValues<ContactInput> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "+221 ",
  organization: "",
  message: "",
};

/** Commercial contact form (§11.1). Client validation mirrors the server action's schema. */
export function ContactForm() {
  const [result, setResult] = useState<FormResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [token, setToken] = useState<string>();
  const statusRef = useRef<HTMLDivElement>(null);

  // Move focus to the outcome (error summary or confirmation) after each submit attempt.
  useEffect(() => {
    if (result) statusRef.current?.focus();
  }, [result]);

  const form = useForm<ContactInput, unknown, ContactRequest>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    reset,
    resetField,
    formState,
  } = form;
  const { errors } = formState;
  const profil = useWatch({ control, name: "profil" });
  const availableSujets = profil ? sujetsByProfil[profil] : sujets;

  // ?profil= & ?sujet= prefill, read on the client so the page stays prerendered.
  useEffect(() => {
    const prefill = parsePrefill(window.location.search);
    if (prefill.profil) setValue("profil", prefill.profil);
    if (prefill.sujet) setValue("sujet", prefill.sujet);
  }, [setValue]);

  // Activity keeps hidden pages mounted: clear a sent form when the visitor leaves (§ preserving UI state).
  useLayoutEffect(() => {
    return () => {
      if (result?.status === "success") {
        reset(EMPTY);
        setResult(null);
      }
    };
  }, [result, reset]);

  function onProfilChange(next: string) {
    const nextProfil = next as ContactRequest["profil"];
    setValue("profil", nextProfil, { shouldValidate: formState.isSubmitted });
    const current = getValues("sujet");
    if (current && !sujetsByProfil[nextProfil].includes(current)) {
      resetField("sujet");
    }
  }

  function onInvalid(fieldErrors: FieldErrors<ContactInput>) {
    const first = Object.keys(fieldErrors)[0];
    if (first) track("contact_error", { field: first });
    setResult({ status: "error", message: copy.errors.summary });
  }

  function onValid(values: ContactRequest, event?: BaseSyntheticEvent) {
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const honeypot = form ? String(new FormData(form).get("website") ?? "") : "";
    startTransition(async () => {
      const response = await submitContact({ values, turnstileToken: token, honeypot });
      setResult(response);
      if (response.status === "success") {
        track("contact_submit", { profil: values.profil, sujet: values.sujet });
      } else {
        for (const [field, message] of Object.entries(response.fieldErrors ?? {})) {
          setError(field as keyof ContactInput, { message });
          track("contact_error", { field });
        }
      }
    });
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

  const describedBy = (name: string, hint?: boolean) =>
    [hint && `${name}-hint`, errors[name as keyof ContactInput] && `${name}-error`]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <form noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="flex flex-col gap-8">
      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {result?.status === "error" && <FormError>{result.message}</FormError>}
      </div>
      <p className="text-sm text-graphite">{frTypo(copy.requiredNote)}</p>

      <fieldset
        className="flex flex-col gap-3"
        aria-describedby={errors.profil ? "profil-error" : undefined}
      >
        <legend className="mb-3 font-medium">{copy.profil.label}</legend>
        <Controller
          control={control}
          name="profil"
          render={({ field }) => (
            <RadioGroup.Root
              value={field.value ?? ""}
              onValueChange={onProfilChange}
              aria-label={copy.profil.label}
              aria-invalid={errors.profil ? true : undefined}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {profils.map((value) => (
                <RadioGroup.Item
                  key={value}
                  value={value}
                  onBlur={field.onBlur}
                  className="min-h-12 rounded-md border border-ink-950/15 px-4 text-left text-sm font-medium transition-colors hover:border-ink-950 data-[state=checked]:border-ink-950 data-[state=checked]:bg-ink-950 data-[state=checked]:text-white"
                >
                  {profilLabels[value]}
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          )}
        />
        {errors.profil?.message && (
          <FieldErrorText id="profil-error">{errors.profil.message}</FieldErrorText>
        )}
      </fieldset>

      <Field id="sujet" label={copy.sujet.label} error={errors.sujet?.message}>
        <select
          id="sujet"
          {...register("sujet")}
          aria-invalid={errors.sujet ? true : undefined}
          aria-describedby={describedBy("sujet")}
          className={fieldClasses}
          defaultValue=""
        >
          <option value="" disabled>
            {copy.sujet.placeholder}
          </option>
          {availableSujets.map((value) => (
            <option key={value} value={value}>
              {sujetLabels[value]}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="firstName" label={copy.firstName.label} error={errors.firstName?.message}>
          <input
            id="firstName"
            autoComplete="given-name"
            {...register("firstName")}
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={describedBy("firstName")}
            className={fieldClasses}
          />
        </Field>
        <Field id="lastName" label={copy.lastName.label} error={errors.lastName?.message}>
          <input
            id="lastName"
            autoComplete="family-name"
            {...register("lastName")}
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={describedBy("lastName")}
            className={fieldClasses}
          />
        </Field>
        <Field id="email" label={copy.email.label} error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            {...register("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={fieldClasses}
          />
        </Field>
        <Field
          id="phone"
          label={copy.phone.label}
          hint={copy.phone.hint}
          error={errors.phone?.message}
        >
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
      </div>

      {profil !== "particulier" && (
        <Field
          id="organization"
          label={copy.organization.label}
          error={errors.organization?.message}
        >
          <input
            id="organization"
            autoComplete="organization"
            {...register("organization")}
            aria-invalid={errors.organization ? true : undefined}
            aria-describedby={describedBy("organization")}
            className={fieldClasses}
          />
        </Field>
      )}

      <Field
        id="message"
        label={copy.message.label}
        hint={copy.message.hint}
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", true)}
          className={cx(fieldClasses, "min-h-40 py-3")}
        />
      </Field>

      {/* Honeypot: invisible to people, tempting to bots (§11.1). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">{copy.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("consent")}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-samir-700"
          />
          <span className="text-sm">
            {frTypo(copy.consent.before)}
            <Link href="/confidentialite" className="text-samir-700 underline underline-offset-4">
              {copy.consent.link}
            </Link>
            {copy.consent.after}
          </span>
        </label>
        {errors.consent?.message && (
          <FieldErrorText id="consent-error">{errors.consent.message}</FieldErrorText>
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
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}

function FieldErrorText({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="text-sm font-medium text-danger-strong">
      {frTypo(children)}
    </p>
  );
}
