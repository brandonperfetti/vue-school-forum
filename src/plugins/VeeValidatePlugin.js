import firebase from "@/helpers/firebase";
import { localize } from "@vee-validate/i18n";
import { email, min, required, url } from "@vee-validate/rules";
import { ErrorMessage, Field, Form, configure, defineRule } from "vee-validate";

export default (app) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("url", url);
  defineRule("unique", async (value, args) => {
    let collection, field, excluding;
    if (Array.isArray(args)) {
      [collection, field, excluding] = args;
    } else {
      ({ collection, field, excluding } = args);
    }
    if (value === excluding) return true;

    const querySnapshot = await firebase
      .firestore()
      .collection(collection)
      .where(field, "==", value)
      .get();
    return querySnapshot.empty;
  });

  configure({
    generateMessage: localize("en", {
      messages: {
        required: "{field} is required",
        email: "{field} must be a valid email",
        min: "{field} must be a minimum of 0:{min} characters",
        unique: "{field} is already taken",
        url: "{field} must be a valid URL",
      },
    }),
  });

  app.component("VeeForm", Form);
  app.component("VeeField", Field);
  app.component("VeeErrorMessage", ErrorMessage);
};
