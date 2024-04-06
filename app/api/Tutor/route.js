import Tutor from "../../models/Tutor";
import { NextResponse } from "next/server";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export async function GET() {
  try {
    const tutors = await Tutor.find();

    return NextResponse.json({ tutors }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const tutors = await Tutor.find({ name: body.name});

    if (isEmpty(tutors)) {
      await Tutor.create(body);
      return NextResponse.json({ message: "Tutor Added" }, { status: 201 });
    }
    
    return NextResponse.json({ message: "Already added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
