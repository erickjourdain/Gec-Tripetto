import { Outlet, useLoaderData } from "react-router";
import { Form } from "../@types/form";

const IndexForm = () => {
  const form = useLoaderData() as Form;

  return <Outlet context={form} />;
};

export default IndexForm;
