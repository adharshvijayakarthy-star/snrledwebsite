"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Minus, Plus, UploadCloud, User, Users, X } from "lucide-react";
import type { EventConfig, Gender } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, normalizeInstagram, normalizePhone } from "@/lib/utils";
import { calculateTotalAmount, getPhaseLabel } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegistrationDraft } from "@/hooks/use-registration-draft";

interface RegistrationWizardProps {
  config: EventConfig;
  onClose: () => void;
}

const TOTAL_STEPS = 5;

const stepLabels = ["Details", "Registration", "Review", "Payment", "Proof"];

export function RegistrationWizard({ config, onClose }: RegistrationWizardProps) {
  const router = useRouter();
  const { draft, saveDraft, clearDraft, loaded } = useRegistrationDraft();
  const hydratedDraftRef = useRef(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [terms, setTerms] = useState({ payment: false, refund: false, rules: false });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    instagram: "",
    gender: "" as Gender | "",
    peopleCount: 1,
  });

  useEffect(() => {
    if (!loaded || hydratedDraftRef.current) return;
    hydratedDraftRef.current = true;
    if (draft.name) {
      queueMicrotask(() => {
        setForm({
          name: draft.name,
          phone: draft.phone,
          instagram: draft.instagram,
          gender: (draft.gender as Gender) || "",
          peopleCount: draft.peopleCount || 1,
        });
        if (draft.step > 1) setStep(draft.step);
      });
    }
  }, [draft, loaded]);

  const phase = config.currentPhase;
  const amount =
    form.gender && form.peopleCount
      ? calculateTotalAmount(form.gender as Gender, form.peopleCount, phase, config)
      : 0;

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };
      saveDraft({
        ...next,
        gender: next.gender || "",
        amount,
        pricingPhase: phase,
        step,
      });
      return next;
    });
  };

  const checkPhoneDuplicate = async (phone: string) => {
    try {
      const res = await fetch(`/api/register/check-phone?phone=${phone}`);
      const data = await res.json();
      if (data.data?.exists) {
        setPhoneError("This phone number has already been registered.");
        return true;
      }
      setPhoneError("");
      return false;
    } catch {
      return false;
    }
  };

  const handleContinueStep1 = async () => {
    const phone = normalizePhone(form.phone);
    if (phone.length !== 10) return;
    setLoading(true);
    const isDuplicate = await checkPhoneDuplicate(phone);
    setLoading(false);
    if (isDuplicate) return;
    setStep(2);
    saveDraft({ step: 2 });
  };

  const handleSubmit = async () => {
    if (!file || !terms.payment || !terms.refund || !terms.rules) return;
    setProcessing(true);

    const messages = [
      "Uploading Payment...",
      "Verifying Submission...",
      "Generating Registration ID...",
      "Almost Done...",
    ];
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = Math.min(msgIndex + 1, messages.length - 1);
    }, 700);

    try {
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: normalizePhone(form.phone),
          instagram: normalizeInstagram(form.instagram),
          gender: form.gender,
          peopleCount: form.peopleCount,
          amount,
          pricingPhase: phase,
        }),
      });

      const regData = await regRes.json();
      if (!regData.success) {
        toast.error(regData.message || "Registration failed");
        setProcessing(false);
        clearInterval(msgInterval);
        return;
      }

      const regId = regData.data.registrationId;
      if (regData.data.existing) {
        toast.info("We found your existing registration and will continue with the proof upload.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("registrationId", regId);

      setUploadProgress(30);
      const uploadRes = await fetch("/api/upload-proof", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        toast.error(uploadData.message || "Upload failed");
        setProcessing(false);
        clearInterval(msgInterval);
        return;
      }

      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 800));
      clearDraft();
      clearInterval(msgInterval);
      router.push(`/success?id=${regId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setProcessing(false);
      clearInterval(msgInterval);
    }
  };

  const handleFileChange = (f: File | null) => {
    if (!f) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(f.type)) {
      toast.error("Please upload PNG or JPEG only.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  if (!loaded) return null;

  if (processing) {
    return (
      <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[#050505] px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(62,231,229,0.12),transparent_58%)]" />
        <BrandLogo src={config.logoUrl} size="wizard" className="relative mb-8" />
        <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="relative mt-6 text-center text-sm uppercase tracking-[0.18em] text-silver">
          Securing your access
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col bg-[#050505]/95 backdrop-blur-xl"
    >
      {/* Progress bar */}
      <div className="sticky top-0 z-10 glass-strong px-6 py-4">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-silver">
              Step {step} of {TOTAL_STEPS}
            </span>
            <p className="mt-1 text-sm font-medium text-highlight">
              {stepLabels[step - 1]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration"
            className="glass flex h-10 w-10 items-center justify-center rounded-[16px] text-silver transition-colors hover:text-highlight"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-auto mt-3 h-0.5 max-w-[760px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-accent teal-glow"
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.45 }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[760px] px-6 py-10 md:py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-7 md:p-9">
                <Badge variant="muted" className="mb-5">Invite request</Badge>
                <h2 className="text-2xl font-bold text-highlight md:text-3xl">
                  Tell us who you are.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-silver">
                  We&apos;ll only use this information to verify your registration.
                </p>
                <div className="mt-8 space-y-6">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    error={phoneError}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      updateForm({ phone: val });
                      setPhoneError("");
                    }}
                  />
                  <Input
                    label="Instagram Username"
                    value={form.instagram}
                    onChange={(e) => updateForm({ instagram: e.target.value })}
                  />
                </div>
                <Button
                  className="mt-10 w-full"
                  size="lg"
                  disabled={!form.name || form.phone.length !== 10 || !form.instagram}
                  loading={loading}
                  onClick={handleContinueStep1}
                >
                  Continue
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <GlassCard className="p-7 md:p-9">
                <Badge variant="live" className="mb-5">{getPhaseLabel(phase)} Live</Badge>
                <h2 className="text-2xl font-bold text-highlight">Choose your entry.</h2>
                <p className="mt-3 text-sm leading-6 text-silver">Select the access type and group size.</p>

                <p className="mt-8 text-xs uppercase tracking-widest text-silver">Gender</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {(["stag", "doe"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateForm({ gender: g })}
                      className={cn(
                        "glass rounded-2xl p-6 text-center transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-white/20",
                        form.gender === g && "border-accent/50 bg-accent/[0.04] teal-glow"
                      )}
                    >
                      {g === "stag" ? (
                        <User className="mx-auto mb-2 h-8 w-8 text-accent" />
                      ) : (
                        <Users className="mx-auto mb-2 h-8 w-8 text-accent" />
                      )}
                      <span className="font-semibold uppercase tracking-wider">
                        {g === "stag" ? "Stag" : "Doe"}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-xs uppercase tracking-widest text-silver">
                  Number of People
                </p>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() =>
                      updateForm({ peopleCount: Math.max(1, form.peopleCount - 1) })
                    }
                    aria-label="Decrease people"
                    className="glass flex h-12 w-12 items-center justify-center rounded-full text-silver transition-colors hover:text-highlight"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-3xl font-bold text-highlight">{form.peopleCount}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateForm({
                        peopleCount: Math.min(
                          config.maxPeoplePerRegistration,
                          form.peopleCount + 1
                        ),
                      })
                    }
                    aria-label="Increase people"
                    className="glass flex h-12 w-12 items-center justify-center rounded-full text-silver transition-colors hover:text-highlight"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                {form.gender && (
                  <div className="mt-8 text-center">
                    <p className="text-sm text-silver">{getPhaseLabel(phase)}</p>
                    <p className="mt-2 text-4xl font-bold text-accent">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-[20px] bg-white/[0.035] p-5">
                  <p className="text-xs uppercase text-silver">Current Pricing</p>
                  <p className="mt-1 font-semibold text-highlight">{getPhaseLabel(phase)}</p>
                  <p className="text-sm text-silver">
                    First {config.phaseSwitchLimit} Registrations
                  </p>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!form.gender}
                    onClick={() => setStep(3)}
                  >
                    Continue
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard className="p-7 md:p-9">
                <Badge variant="muted" className="mb-5">Review</Badge>
                <h2 className="text-2xl font-bold text-highlight">Confirm the details.</h2>
                <p className="mt-3 text-sm leading-6 text-silver">
                  Your invite is created from this information.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    { label: "Name", value: form.name, editStep: 1 },
                    { label: "Phone", value: form.phone, editStep: 1 },
                    { label: "Instagram", value: `@${normalizeInstagram(form.instagram)}`, editStep: 1 },
                    { label: "Gender", value: form.gender === "stag" ? "Stag" : "Doe", editStep: 2 },
                    { label: "People", value: String(form.peopleCount), editStep: 2 },
                    { label: "Amount", value: formatCurrency(amount), editStep: 2 },
                    { label: "Phase", value: getPhaseLabel(phase), editStep: 2 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl bg-white/[0.035] px-4 py-3"
                    >
                      <div>
                        <p className="text-xs text-silver">{item.label}</p>
                        <p className="font-medium text-highlight">{item.value}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(item.editStep)}
                        className="text-xs font-semibold uppercase tracking-[0.12em] text-accent hover:text-accent-hover"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-5 text-silver">
                  Venue details will only be shared after payment verification.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(4)}>
                    Continue to Payment
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard className="p-7 md:p-9">
                <Badge variant="live" className="mb-5">Payment</Badge>
                <h2 className="text-2xl font-bold text-highlight">Complete your payment.</h2>
                <p className="mt-3 text-sm leading-6 text-silver">Scan the QR code and pay the exact amount.</p>

                <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
                  <div className="mx-auto w-full max-w-[260px] rounded-[28px] glass p-4">
                    <img
                      src={config.qrImageUrl}
                      alt="Payment QR"
                      className="w-full rounded-[18px]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 text-silver">
                      <CreditCard className="h-5 w-5 text-accent" strokeWidth={1.5} />
                      <span className="text-sm">Amount to pay</span>
                    </div>
                    <p className="mt-3 text-4xl font-bold text-accent md:text-5xl">
                      {formatCurrency(amount)}
                    </p>
                    <p className="mt-3 text-sm text-chrome">{config.upiId}</p>

                    <div className="mt-8 space-y-3 text-sm text-silver">
                      <p>1. Scan QR</p>
                      <p>2. Pay exact amount</p>
                      <p>3. Take screenshot</p>
                      <p>4. Upload proof</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[20px] border border-warning/20 bg-warning/[0.035] p-5">
                  <p className="text-xs leading-5 text-silver">
                    Payments are manually verified. Venue details shared after verification.
                  </p>
                </div>

                <Button className="mt-8 w-full" size="lg" onClick={() => setStep(5)}>
                  I Have Paid
                </Button>
                <Button variant="secondary" className="mt-4 w-full" onClick={() => setStep(3)}>
                  Back
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard className="p-7 md:p-9">
                <Badge variant="muted" className="mb-5">Proof</Badge>
                <h2 className="text-2xl font-bold text-highlight">Upload payment proof.</h2>
                <p className="mt-3 text-sm leading-6 text-silver">PNG or JPEG up to 5MB.</p>

                <label className="mt-8 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-white/20 bg-white/[0.025] p-8 text-center transition-colors hover:border-accent/40 hover:bg-white/[0.04]">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  />
                  {preview ? (
                    <Image src={preview} alt="Preview" width={240} height={240} className="max-h-[240px] w-auto rounded-2xl object-contain" />
                  ) : (
                    <>
                      <UploadCloud className="mb-4 h-9 w-9 text-accent" strokeWidth={1.4} />
                      <p className="font-medium text-highlight">Tap to upload screenshot</p>
                      <p className="mt-2 text-xs text-silver/60">PNG, JPEG, JPG</p>
                    </>
                  )}
                </label>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <div className="mt-8 space-y-4">
                  {[
                    { key: "payment" as const, label: "I confirm this payment belongs to me." },
                    { key: "refund" as const, label: "I understand there are no refunds." },
                    { key: "rules" as const, label: "I agree to the event rules." },
                  ].map((t) => (
                    <label key={t.key} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white/[0.025] p-4">
                      <input
                        type="checkbox"
                        checked={terms[t.key]}
                        onChange={(e) =>
                          setTerms((prev) => ({ ...prev, [t.key]: e.target.checked }))
                        }
                        className="mt-1 accent-accent"
                      />
                      <span className="text-sm text-silver">{t.label}</span>
                    </label>
                  ))}
                </div>

                <Button
                  className="mt-8 w-full"
                  size="lg"
                  disabled={!file || !terms.payment || !terms.refund || !terms.rules}
                  onClick={handleSubmit}
                >
                  Submit Registration
                </Button>
                <Button variant="secondary" className="mt-4 w-full" onClick={() => setStep(4)}>
                  Back
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
