import Tutor from "../../../models/Tutor";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { name } = params;
  try {
    const tutors = await Tutor.find({ name: name });
    return NextResponse.json({ tutors }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { name } = params;
  try {
    const body = await request.json();
    const tutors = await Tutor.findOneAndUpdate(
      { name: name },
      body
    );
    return NextResponse.json({ message: "tutor updated" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
