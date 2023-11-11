import { Paper } from "@mui/material";
import { Export, IDefinition, Import, Instance } from "@tripetto/runner";
import { ChatRunner } from "@tripetto/runner-chat";
import { AutoscrollRunner } from "@tripetto/runner-autoscroll";
import { ClassicRunner } from "@tripetto/runner-classic";
import localeClassic from "@tripetto/runner-classic/runner/locales/fr.json";
import localeChat from "@tripetto/runner-chat/runner/locales/fr.json";
import localeAutoScroll from "@tripetto/runner-autoscroll/runner/locales/fr.json";
import translationClassic from "@tripetto/runner-classic/runner/translations/fr.json";
import translationChat from "@tripetto/runner-chat/runner/translations/fr.json";
import translationAutoScroll from "@tripetto/runner-autoscroll/runner/translations/fr.json";
import { ILocale, TTranslation } from "@tripetto/runner/module/l10n";
import { useAppContext } from "../utils/appContext";
import { Context } from "../@types/context";

type TripettoProps = {
  form: IDefinition;
  data?: Export.IExportables;
  onSubmit?: (instance: Instance) => boolean;
};

const PlayTripetto = ({ form, data, onSubmit }: TripettoProps) => {
  let runner: JSX.Element;

  // récupération du contexte de l'application
  const { appContext } = useAppContext() as Context;

  const onImport = (instance: Instance) => {
    const values: Import.IFieldByName[] = [];
    if (data) data.fields.forEach(field => {
      values.push({
        name: field.name,
        value: field.value
      })
    });
    Import.fields(instance, values);
  }

  // choix du type de formulaire
  switch (appContext.runner) {
    case "Chat":
      runner = (
        <ChatRunner
          definition={form}
          locale={localeChat as unknown as ILocale}
          translations={translationChat as unknown as TTranslation}
          customStyle={{ margin: "10px", padding: "5px" }}
          onImport={onImport}
          onSubmit={onSubmit}
        />
      );
      break;
    case "Autoscroll":
      runner = (
        <AutoscrollRunner
          definition={form}
          locale={localeAutoScroll as unknown as ILocale}
          translations={translationAutoScroll as unknown as TTranslation}
          customStyle={{ margin: "10px", padding: "5px" }}
          onImport={onImport}
          onSubmit={onSubmit}
        />
      );
      break;
    case "Classic":
    default:
      runner = (
        <ClassicRunner
          definition={form}
          locale={localeClassic as unknown as ILocale}
          translations={translationClassic as unknown as TTranslation}
          customStyle={{ margin: "10px", padding: "5px" }}
          onImport={onImport}
          onSubmit={onSubmit}
        />
      );
      break;
  }

  return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      {runner}
    </Paper>
  );
};

export default PlayTripetto;
