import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiService } from '../../services/aiService';

export const fetchSessions = createAsyncThunk('aiMentor/fetchSessions', async (_, { rejectWithValue }) => {
  try {
    return await aiService.getSessions();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createNewSession = createAsyncThunk('aiMentor/createNewSession', async ({ topic, title }, { rejectWithValue }) => {
  try {
    return await aiService.createSession(topic, title);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteSession = createAsyncThunk('aiMentor/deleteSession', async (sessionId, { rejectWithValue }) => {
  try {
    return await aiService.deleteSession(sessionId);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const sendAiMessage = createAsyncThunk(
  'aiMentor/send',
  async ({ message, context, replyTo, persona, codeAttachment }, { rejectWithValue }) => {
    try {
      return await aiService.sendMessage(message, context, replyTo, persona, codeAttachment);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const runSandbox = createAsyncThunk(
  'aiMentor/runSandbox',
  async ({ code, language }, { rejectWithValue }) => {
    try {
      return await aiService.runSandboxCode(code, language);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const aiMentorSlice = createSlice({
  name: 'aiMentor',
  initialState: {
    sessions: [],
    activeSessionId: null,
    persona: 'direct', // 'direct' | 'socratic' | 'remediation' | 'interview' | 'debugger'
    isTyping: false,
    sandboxOutput: null,
    isSandboxRunning: false,
    savedNotes: [
      {
        id: 'note_1',
        title: 'Prefix Sum 1-based Template',
        snippet: 'prefix = [0] * (N + 1)\nfor i, v in enumerate(nums): prefix[i + 1] = prefix[i] + v',
        topic: 'Prefix Sum',
        savedAt: 'Aug 11, 2026',
      },
      {
        id: 'note_2',
        title: 'HashMap + Prefix Subarray Formula',
        snippet: 'prefix_sum - previous_sum = k  =>  previous_sum = prefix_sum - k',
        topic: 'HashMap & Sets',
        savedAt: 'Aug 10, 2026',
      },
    ],
    error: null,
  },
  reducers: {
    setActiveSessionId: (state, action) => {
      state.activeSessionId = action.payload;
    },
    setPersona: (state, action) => {
      state.persona = action.payload;
    },
    addSavedNote: (state, action) => {
      state.savedNotes.unshift(action.payload);
    },
    removeSavedNote: (state, action) => {
      state.savedNotes = state.savedNotes.filter((n) => n.id !== action.payload);
    },
    clearSandboxOutput: (state) => {
      state.sandboxOutput = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload.sessions;
        state.activeSessionId = action.payload.activeSessionId;
      })
      // Create Session
      .addCase(createNewSession.fulfilled, (state, action) => {
        state.sessions = action.payload.sessions;
        state.activeSessionId = action.payload.activeSessionId;
      })
      // Delete Session
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = action.payload.sessions;
        state.activeSessionId = action.payload.activeSessionId;
      })
      // Send Message
      .addCase(sendAiMessage.pending, (state, action) => {
        state.isTyping = true;
        const currentSession = state.sessions.find((s) => s.id === state.activeSessionId);
        if (currentSession) {
          currentSession.messages.push({
            id: `temp_user_${Date.now()}`,
            sender: 'user',
            text: action.meta.arg.message,
            timestamp: new Date().toISOString(),
            replyTo: action.meta.arg.replyTo,
            codeAttachment: action.meta.arg.codeAttachment,
          });
        }
      })
      .addCase(sendAiMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        const currentSession = state.sessions.find((s) => s.id === action.payload.sessionId);
        if (currentSession) {
          currentSession.messages = currentSession.messages.filter((m) => !m.id.startsWith('temp_user_'));
          currentSession.messages.push(action.payload.userMsg);
          currentSession.messages.push(action.payload.aiMsg);
        }
      })
      .addCase(sendAiMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload;
      })
      // Run Sandbox
      .addCase(runSandbox.pending, (state) => {
        state.isSandboxRunning = true;
      })
      .addCase(runSandbox.fulfilled, (state, action) => {
        state.isSandboxRunning = false;
        state.sandboxOutput = action.payload.output;
      })
      .addCase(runSandbox.rejected, (state, action) => {
        state.isSandboxRunning = false;
        state.sandboxOutput = `Execution error: ${action.payload}`;
      });
  },
});

export const { setActiveSessionId, setPersona, addSavedNote, removeSavedNote, clearSandboxOutput } = aiMentorSlice.actions;
export default aiMentorSlice.reducer;

