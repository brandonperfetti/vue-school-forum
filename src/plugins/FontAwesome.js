import { library } from "@fortawesome/fontawesome-svg-core";
import { faCamera, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faCamera);

export default (app) => {
  app.component("fontAwesome", FontAwesomeIcon);
};
