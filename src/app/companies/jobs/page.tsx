"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { createJob } from "@/actions/jobs/createJob";
import { useRef } from "react";

const initialState = {
  errors: undefined,
  success: false,
  message: "",
};

export default function Page() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createJob, initialState);
  const { pending } = useFormStatus();

  return (
    <form
      ref={formRef}
      action={(e) => {
        formAction(e);
        if (state.success) formRef.current?.reset();
      }}
    >
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Créer une entrée d emploi</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Remplissez les informations ci-dessous pour poster une nouvelle
            entrée d emploi
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Intitulé du poste</Label>
            <Input
              name="title"
              id="title"
              placeholder="Ingénieur logiciel"
              required
            />
            <p aria-live="polite">{state.errors?.title?.toString()}</p>
          </div>
          <input type="hidden" name="companyId" value={1} />
          {/* <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input id="company" placeholder="Acme Inc" required />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="description">La description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Entrez une description détaillée du poste"
              required
            />
            <p aria-live="polite">{state.errors?.description?.toString()}</p>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="skills">Compétences requises</Label>
            <Textarea
              id="skills"
              placeholder="Entrez les compétences requises pour le poste"
              required
            />
          </div> */}
          {/* <div className="space-y-2">
            <Label htmlFor="instructions">Instructions d application</Label>
            <Textarea
              id="instructions"
              placeholder="Entrez les instructions pour postuler au poste"
              required
            />
          </div> */}
          {state.errors && (
            <p aria-live="polite">{JSON.stringify(state.errors)}</p>
          )}
          <Button disabled={pending} className="w-full">
            Soumettre
          </Button>
        </div>
      </div>
    </form>
  );
}
