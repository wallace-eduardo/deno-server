import { object, string, email, minLength } from "https://deno.land/x/valibot@v0.25.0/mod.ts";

export const userSchema = object({
  name: string([minLength(1, "Name is required")]),
  email: string([email("Invalid email")]),
});
