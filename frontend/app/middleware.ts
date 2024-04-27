import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("authToken");

    if (req.nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.next();
    }

    if (!token) {
        const loginUrl = new URL("/auth/login", req.url);
        return NextResponse.redirect(loginUrl.toString());
    }

    return NextResponse.next();
}