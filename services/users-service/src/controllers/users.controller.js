import { addUserSchema, userIdParamSchema } from "../validations/user.validation.js";
import { createUser, getUserDetailsWithTotal, listUsers } from "../services/users.service.js";

function validationError(res, parsed) {
    return res.status(400).json({
        id: "ERR-VALIDATION",
        message: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join(", "),
    });
}

export async function getAllUsers(req, res, next) {
    try {
        const users = await listUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
}

export async function addUser(req, res, next) {
    const parsed = addUserSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed);

    try {
        const user = await createUser(parsed.data);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

export async function getUserDetails(req, res, next) {
    const parsed = userIdParamSchema.safeParse(req.params);
    if (!parsed.success) return validationError(res, parsed);

    try {
        const data = await getUserDetailsWithTotal(parsed.data.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}
