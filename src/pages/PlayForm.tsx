import ChatTripetto from "../components/PlayTripetto";
import { Form } from "../@types/form";
import { useOutletContext } from "react-router-dom";

const PlayForm = () => {
  // récupération du formulaire à mettre à jour via le contexte de la route
  const form = useOutletContext() as Form;

  return form.formulaire && <ChatTripetto form={form.formulaire} />;
};

export default PlayForm;
