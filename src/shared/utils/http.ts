import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonCreated<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 201, ...init });
}

export function jsonBadRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function jsonUnauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function jsonForbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function jsonNotFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

