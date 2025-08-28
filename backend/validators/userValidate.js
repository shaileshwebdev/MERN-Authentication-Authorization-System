import yup, { Schema } from "yup";

export const userSchema = yup.object({
  username: yup
    .string()
    .min(3, "user name must be atleast 3 characters")
    .required(),
  email: yup.string().email("the email is not valid one").required(),
  password: yup
    .string()
    .min(4, "password must be atleast 4 character")
    .required(),
});

export const validateUser = (Schema) => async (req, res, next) => {
  try {
    await Schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      errors: err.errors,
    });
  }
};
