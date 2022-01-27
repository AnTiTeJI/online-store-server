import { Request, Response } from "express";
import ApiError from "../error/ApiError";

function ErrorMiddleware(error: Error | ApiError, req: Request, res: Response) {
    if (error instanceof ApiError) {
        console.error(`Status code: ${error.status}\n${error.message}`);
        return res.status(error.status).json({ error: error.message });
    }
    console.error("Unexpected error\n", error);
    return res.status(500).json({ msg: "Unexpected error" });
}

export = ErrorMiddleware;