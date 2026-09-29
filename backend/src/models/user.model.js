import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		// One User document is created per account; research jobs reference this _id.
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			minLength: 2,
			maxLength: 80,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: 8,
			select: false,
		},
	},
	{ timestamps: true },
);
userSchema.pre('save', async function hashPassword() {
	if (!this.isModified('password')) {
		return;
	}

	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
