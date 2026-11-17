export default function validate(req, _res, next) {
  const errors = req.validationErrors;
  if (errors?.length) return next(Object.assign(new Error(errors[0].msg), { status: 400, errors: errors.map(({ path, msg }) => ({ field: path, message: msg })) }));
  next();
}
