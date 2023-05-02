const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    guildId: String,
    userId: String,
    rolesId: [],
    voice: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    eco: {
        balance: { type: Number, default: 0 },
        timers: {
            daily: { type: Number, default: 0 },
            timely: { type: Number, default: 0 },
            weekly: { type: Number, default: 0 }
        }
    },
    marry: {
        userId: { type: String, default: null },
        room: {
            voiceId: { type: String, default: null }
        }
    },
    private_voices: {
        voiceId: { type: String, default: null },
        lock: { type: Boolean, default: false }
    }

})

module.exports = mongoose.model('user', userSchema);