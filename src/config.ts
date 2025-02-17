require('dotenv').config();
import * as yup from 'yup';

const createRequiredErrMessage = (
  envVar: string,
  possibleValues?: string[]
) => {
  const initialMessage = `${envVar} environment variable is required.`;

  if (!possibleValues || possibleValues.length === 0) {
    return initialMessage;
  }

  return `${initialMessage} Use one of the possible values: ${possibleValues.join(
    ', '
  )}`;
};

const acceptedEnvironments = ['development', 'production'];

const ConfigSchema = yup.object({
  environment: yup
    .string()
    .oneOf(acceptedEnvironments)
    .required(
      createRequiredErrMessage('NODE_ENV', acceptedEnvironments)
    ),
  botToken: yup
    .string()
    .required(createRequiredErrMessage('BOT_TOKEN')),
  dataPath: yup
    .string()
    .required(createRequiredErrMessage('DATA_PATH')),
  localesPath: yup.string().default('./locales'),
  messageTimeoutInMinutes: yup.number().integer().default(2),
  messageTimeoutEnabled: yup.boolean().default(true),
});

export const loadConfiguration = async () => {
  const unsafeConfig = {
    environment: process.env.NODE_ENV,
    botToken: process.env.BOT_TOKEN,
    dataPath: process.env.DATA_PATH,
    localesPath: process.env.LOCALES_PATH,
    messageTimeoutEnabled: process.env.MESSAGE_TIMEOUT_ENABLED
      ? process.env.MESSAGE_TIMEOUT_ENABLED === 'true'
      : undefined,
    messageTimeoutInMinutes: process.env.MESSAGE_TIMEOUT_IN_MINUTES,
  };

  const config = await ConfigSchema.validate(unsafeConfig);

  return config;
};

export type Config = yup.InferType<typeof ConfigSchema>;
