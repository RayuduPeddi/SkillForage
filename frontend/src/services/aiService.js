import { delay } from './api';
import { storage } from '../utils/storage';

const SESSIONS_KEY = 'ai_mentor_sessions';
const ACTIVE_SESSION_KEY = 'ai_mentor_active_session_id';

const DEFAULT_SESSIONS = [
  {
    id: 'session_prefix_sum',
    title: 'Prefix Sum & Subarray Invariants',
    topic: 'Prefix Sum',
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    messages: [
      {
        id: 'msg_welcome',
        sender: 'ai',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        adaptiveContext: {
          topic: 'Prefix Sum',
          mastery: '43%',
          difficulty: 'Level 2 (Remediation)',
        },
        text: `Hello Rayudu! I'm your adaptive AI Academic Mentor. I am actively synchronized with your diagnostic results.

I noticed your current accuracy in **Prefix Sum** is **43%** (boundary index mistakes) and **HashMap** is **52%**.

What would you like to work on right now?`,
        suggestedActions: [
          '🔍 Diagnose why I am struggling with Prefix Sum',
          '💡 Give me a Step-by-Step Code Proof',
          '🧪 Generate an Interactive Adaptive Mini-Quiz',
          '📅 Create a 5-Day Revision Blueprint',
        ],
      },
    ],
  },
  {
    id: 'session_binary_search',
    title: 'Binary Search Edge Cases',
    topic: 'Binary Search',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        id: 'msg_bs_1',
        sender: 'ai',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        adaptiveContext: {
          topic: 'Binary Search',
          mastery: '45%',
          difficulty: 'Level 2 (Pointers)',
        },
        text: `Welcome back! In this session, we explored monotonic condition spaces and avoiding infinite loops in \`while (left < right)\` vs \`while (left <= right)\`.`,
        suggestedActions: [
          '💡 Compare left <= right vs left < right templates',
          '🧪 Practice rotated sorted array pivot search',
        ],
      },
    ],
  },
  {
    id: 'session_hashmap_trees',
    title: 'HashMap Lookups & Tree BFS/DFS',
    topic: 'HashMap & Sets',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    messages: [
      {
        id: 'msg_hm_1',
        sender: 'ai',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        adaptiveContext: {
          topic: 'HashMap & Sets',
          mastery: '52%',
          difficulty: 'Level 2',
        },
        text: `We reviewed how frequency counting tables reduce $O(N^2)$ pair searches to amortized $O(N)$ time with $O(N)$ space.`,
        suggestedActions: [
          '💡 Show two-pass vs one-pass HashMap two-sum',
          '🧪 Checkpoint on hash collision mechanics',
        ],
      },
    ],
  },
];

export const aiService = {
  async getSessions() {
    await delay(100);
    const sessions = storage.get(SESSIONS_KEY);
    if (!sessions || sessions.length === 0) {
      storage.set(SESSIONS_KEY, DEFAULT_SESSIONS);
      storage.set(ACTIVE_SESSION_KEY, DEFAULT_SESSIONS[0].id);
      return { sessions: DEFAULT_SESSIONS, activeSessionId: DEFAULT_SESSIONS[0].id };
    }
    const activeId = storage.get(ACTIVE_SESSION_KEY) || sessions[0]?.id;
    return { sessions, activeSessionId: activeId };
  },

  async createSession(topic = 'Prefix Sum', title = '') {
    await delay(100);
    const sessions = storage.get(SESSIONS_KEY) || DEFAULT_SESSIONS;
    const newSession = {
      id: `session_${Date.now()}`,
      title: title || `${topic} Mastery Session`,
      topic: topic,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          adaptiveContext: {
            topic: topic,
            mastery: topic === 'Prefix Sum' ? '43%' : topic === 'HashMap & Sets' ? '52%' : '72%',
            difficulty: 'Adaptive Live',
          },
          text: `Started a fresh mentorship workspace focused on **${topic}**! Ask any algorithmic question, paste your code for instant review, or request a customized drill.`,
          suggestedActions: [
            `💡 Explain the core invariant of ${topic}`,
            `🧪 Give me an adaptive drill for ${topic}`,
            '💻 Review my code template',
          ],
        },
      ],
    };

    const updated = [newSession, ...sessions];
    storage.set(SESSIONS_KEY, updated);
    storage.set(ACTIVE_SESSION_KEY, newSession.id);
    return { sessions: updated, activeSessionId: newSession.id };
  },

  async deleteSession(sessionId) {
    await delay(100);
    const sessions = storage.get(SESSIONS_KEY) || DEFAULT_SESSIONS;
    const updated = sessions.filter((s) => s.id !== sessionId);
    const fallbackId = updated[0]?.id || null;
    storage.set(SESSIONS_KEY, updated);
    storage.set(ACTIVE_SESSION_KEY, fallbackId);
    return { sessions: updated, activeSessionId: fallbackId };
  },

  async sendMessage(userMessage, context = {}, replyToMessage = null, persona = 'direct', codeAttachment = null) {
    await delay(450); // realistic typing simulation

    const sessions = storage.get(SESSIONS_KEY) || DEFAULT_SESSIONS;
    const activeId = storage.get(ACTIVE_SESSION_KEY) || sessions[0]?.id;
    const currentSession = sessions.find((s) => s.id === activeId) || sessions[0];

    const userMsgObj = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: userMessage,
      timestamp: new Date().toISOString(),
      replyTo: replyToMessage
        ? {
            id: replyToMessage.id,
            text: replyToMessage.text?.slice(0, 90) + (replyToMessage.text?.length > 90 ? '...' : ''),
            sender: replyToMessage.sender,
          }
        : null,
      codeAttachment,
    };

    let aiResponseText = '';
    let interactiveQuiz = null;
    const lower = (userMessage + (codeAttachment?.code || '')).toLowerCase();

    // Persona-based response generation
    if (persona === 'socratic') {
      aiResponseText = `### 🧠 Socratic Guidance: Think Through the Invariant

Let's dissect this systematically together. Before jumping straight into syntax:

1. **What is the subproblem state?**
   If you have calculated the running total up to index $i$, what additional piece of information do you need to find a contiguous range ending at $i$?

2. **Reflect on the constraint**:
   - What happens when your query starts at index 0?
   - Can you formulate the mathematical relationship: $\\text{sum}(L, R) = P[R+1] - ?$

*Take a moment to reason through index alignment, or tell me your hypothesis!*`;
    } else if (persona === 'interview') {
      aiResponseText = `### 💼 Technical Mock Interview Evaluation

**Interviewer Prompt**:
*"Great! Let's walk through this problem as if we are on a live FAANG whiteboard session."*

1. **Clarifying Questions & Constraints**:
   - Are there negative numbers or zero in the array? (Crucial: if negative, sliding window fails, prefix sum + hashmap is mandatory).
   - What are the array size bounds ($N \\le 10^5$ requires $O(N)$ or $O(N \\log N)$).
2. **Complexity Target**:
   - Time Complexity: **$O(N)$ single pass**
   - Space Complexity: **$O(N)$ auxiliary map**
3. **Interviewer Question for You**:
   How would you handle integer overflow if the prefix sums exceed $2^{31}-1$?`;
    } else if (persona === 'debugger' || codeAttachment) {
      aiResponseText = `### 🔬 Code Review & Complexity Analysis

I analyzed your provided implementation:

\`\`\`python
# Optimized & Corrected Invariant Implementation
class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        count = 0
        current_sum = 0
        # Map stores prefix_sum frequencies. Seed {0: 1} for sums equal to k from index 0
        prefix_counts = {0: 1}
        
        for num in nums:
            current_sum += num
            # Check if (current_sum - k) occurred previously
            if (current_sum - k) in prefix_counts:
                count += prefix_counts[current_sum - k]
            
            prefix_counts[current_sum] = prefix_counts.get(current_sum, 0) + 1
            
        return count
\`\`\`

**Key Takeaways**:
- **Complexity**: $O(N)$ Time (single iteration over $N$), $O(N)$ Space (hash map stores at most $N+1$ unique sums).
- **Critical Invariant**: Initializing \`prefix_counts = {0: 1}\` ensures subarrays starting at index 0 that equal $k$ are counted properly.`;
    } else if (lower.includes('quiz') || lower.includes('test') || lower.includes('drill')) {
      aiResponseText = `### 🧪 Adaptive Mini-Quiz: Prefix Sum Invariants
Here is a live diagnostic question generated specifically for your **${context.currentTopic || 'Prefix Sum'} (43% mastery)** focus area. Select your answer directly below:`;
      interactiveQuiz = {
        id: `quiz_inchat_${Date.now()}`,
        question: 'Given an array `nums = [3, 1, 4, 2]`, what is the 1-based prefix sum array of size 5?',
        options: [
          { id: 'opt_1', text: '[0, 3, 4, 8, 10]', isCorrect: true, explanation: 'Correct! 1-based prefix array starts with prefix[0] = 0, and prefix[i] = prefix[i-1] + nums[i-1].' },
          { id: 'opt_2', text: '[3, 4, 8, 10, 0]', isCorrect: false, explanation: 'Incorrect. The padding 0 should be at index 0 to guard against out-of-bounds queries when L=0.' },
          { id: 'opt_3', text: '[0, 3, 1, 4, 2]', isCorrect: false, explanation: 'Incorrect. Each index must store the cumulative running total, not just individual elements.' },
        ],
      };
    } else if (lower.includes('proof') || lower.includes('code') || lower.includes('template')) {
      aiResponseText = `### 💡 Mathematical Proof & Optimal Code Template

**Invariant Statement**:
For any 0-indexed array $A$ of size $N$, let $P$ be a prefix sum array of size $N+1$ such that:
$$P[k] = \\sum_{i=0}^{k-1} A[i] \\quad \\text{with } P[0] = 0$$

Then the sum of any subarray from index $L$ to $R$ is:
$$\\sum_{i=L}^{R} A[i] = P[R+1] - P[L]$$

\`\`\`python
class PrefixSumEngine:
    def __init__(self, nums: list[int]):
        # Size N+1 guards against negative index out-of-bounds
        self.prefix = [0] * (len(nums) + 1)
        for i, val in enumerate(nums):
            self.prefix[i + 1] = self.prefix[i] + val

    def query_range(self, L: int, R: int) -> int:
        """Computes sum in strictly O(1) time and O(N) auxiliary space."""
        return self.prefix[R + 1] - self.prefix[L]

# Example Usage:
engine = PrefixSumEngine([2, 4, 6, 8, 10])
print(engine.query_range(1, 3)) # 4 + 6 + 8 = 18
\`\`\`

Notice how initializing index 0 with 0 eliminates messy \`if L == 0\` branch checks!`;
    } else if (lower.includes('weakest') || lower.includes('struggling') || lower.includes('prefix sum') || lower.includes('diagnose')) {
      aiResponseText = `### 🎯 Diagnostic Breakdown: Why You Are Struggling with Prefix Sum

Based on your diagnostic quizzes (current accuracy: **43%**), SkillForage's adaptive model identified 2 core misconceptions:

1. **The Range Boundary Trap**:
   - When asked for the sum between index $L$ and index $R$, your quizzes showed off-by-one errors.
   - Using 0-indexed prefix: $\\text{sum}(L, R) = \\text{prefix}[R] - \\text{prefix}[L-1]$.
   - When $L = 0$, $L-1$ causes an index crash.
   - **Remedy**: Always use a 1-based prefix array of size $N+1$.

2. **Negative Numbers & Sliding Window Confusion**:
   - When elements can be negative, sliding window loses monotonicity.
   - You must pair Prefix Sum with a **HashMap** to store previously seen cumulative sums.

Would you like to try a quick interactive check or view practice problems?`;
    } else if (lower.includes('plan') || lower.includes('revision') || lower.includes('schedule')) {
      aiResponseText = `### 📅 Your Personalized 5-Day Adaptive Roadmap

Targeting **Prefix Sum (43%)** and **HashMap (52%)**:

- **Day 1 (1D Prefix Array)**: Master immutable range sum queries with $N+1$ array template.
- **Day 2 (Prefix Sum + Frequency Map)**: Solve "Subarray Sum Equals K" and "Subarrays Divisible by K".
- **Day 3 (Difference Arrays)**: Master range increment updates in $O(1)$ time.
- **Day 4 (2D Prefix Matrices)**: Learn inclusion-exclusion principle for 2D submatrix sums.
- **Day 5 (Adaptive Re-assessment)**: Complete the diagnostic assessment to unlock Sliding Window!`;
    } else {
      aiResponseText = `I understand! Regarding "${userMessage}":

Since your current adaptive focus is **${context.currentTopic || 'Prefix Sum'}** and your overall mastery is **${context.overallMastery || '72%'}**, I'm tailoring my guidance to help you build intuitive invariant thinking.

Feel free to ask me to explain any proof step, generate targeted code examples, or run an interactive drill!`;
    }

    const aiMsgObj = {
      id: `msg_ai_${Date.now()}`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toISOString(),
      adaptiveContext: {
        topic: context.currentTopic || currentSession.topic || 'Prefix Sum',
        mastery: `${context.overallMastery || 43}%`,
        difficulty: `Adaptive • ${persona.toUpperCase()}`,
      },
      interactiveQuiz,
      suggestedActions: [
        '💡 Show me the Code Proof',
        '🧪 Generate another Mini-Quiz',
        '🔍 Explain Intuition like I am 5',
      ],
    };

    // Update active session messages
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === currentSession.id) {
        return {
          ...sess,
          updatedAt: new Date().toISOString(),
          messages: [...sess.messages, userMsgObj, aiMsgObj],
        };
      }
      return sess;
    });

    storage.set(SESSIONS_KEY, updatedSessions);

    return { userMsg: userMsgObj, aiMsg: aiMsgObj, sessionId: currentSession.id };
  },

  async runSandboxCode(code, language = 'python') {
    await delay(350);
    // Simulated realistic sandbox execution output
    if (language === 'python') {
      return {
        success: true,
        output: `=== Sandbox Execution (${language}) ===\n[Running test cases]\nTest 1: PrefixSumEngine([2, 4, 6, 8, 10]).query_range(1, 3) -> Output: 18 (Expected: 18) [PASSED]\nTest 2: PrefixSumEngine([1, -1, 1, -1]).query_range(0, 3) -> Output: 0 (Expected: 0) [PASSED]\nTest 3: Single element array query -> Output: 5 (Expected: 5) [PASSED]\n\nExecution Time: 12ms | Memory: 14.2 MB\nStatus: All test cases passed successfully!`,
      };
    }
    return {
      success: true,
      output: `=== Sandbox Execution (${language}) ===\nCompiled and executed successfully.\nOutput: Range query result verified.\nExecution Time: 8ms`,
    };
  },
};

