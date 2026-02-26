import { BookingStatus } from "@/types";
import mongoose, { Document, Schema, model, models } from "mongoose";

export interface Booking extends Document {
    locationid: mongoose.Types.ObjectId; // Fixed type for population
    userid: string;
    bookingdate: Date;
    starttime: Date;
    endtime: Date;
    timeoffset: number;
    amount: number;
    phone?: string;      
    plate: string;      
    status: BookingStatus; // Use enum for strict typing
    stripesessionid?: string;
}

const BookingSchema = new Schema<Booking>({
    locationid: { 
        type: Schema.Types.ObjectId, 
        ref: 'ParkingLocation', 
        required: true,
        index: true // Speeds up queries for specific parking lots
    },
    userid: { type: String, required: true },
    bookingdate: { 
        type: Date, 
        required: true,
        index: true // Critical for the Admin Timeline date filter
    },
    starttime: { type: Date, required: true },
    endtime: { type: Date, required: true },
    plate: { 
        type: String, 
        required: true, 
        uppercase: true, 
        trim: true 
    },
    phone: String,
    timeoffset: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: Object.values(BookingStatus), // Ensures data integrity
        default: BookingStatus.PENDING,
        index: true
    },
    stripesessionid: String
}, {
    timestamps: true
})

// Compound index: dramatically speeds up checking availability and admin views
BookingSchema.index({ locationid: 1, bookingdate: 1, status: 1 });

export const BookingModel = models.Booking || model<Booking>('Booking', BookingSchema)