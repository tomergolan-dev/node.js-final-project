import User from "../models/user.model.js";
import Cost from "../models/cost.model.js";

function makeError(id, message, statusCode = 400) {
    const err = new Error(message);
    err.id = id;
    err.statusCode = statusCode;
    return err;
}

export async function listUsers() {
    return User.find({}, { _id: 0 }).lean();
}

export async function createUser(userData) {
    try {
        return await User.create(userData);
    } catch (err) {
        if (err?.code === 11000) {
            // ✅ conflict
            throw makeError("ERR-DUPLICATE", "User id already exists", 409);
        }
        throw err;
    }
}

export async function getUserDetailsWithTotal(userId) {
    const user = await User.findOne({ id: userId }, { _id: 0 }).lean();
    if (!user) {
        throw makeError("ERR-NOT-FOUND", "User not found", 404);
    }

    const result = await Cost.aggregate([
        { $match: { userid: userId } },
        { $group: { _id: null, total: { $sum: "$sum" } } },
    ]);

    const total = result.length ? result[0].total : 0;

    return {
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        total,
    };
}
