# MindWell — Domain-Specific Rules

## Platform Overview

MindWell is a university mental health platform connecting students with counselors.

### User Roles
| Role | Description |
|------|-------------|
| **Student** | Books sessions, chats with counselor, views resources |
| **Counselor** | Manages schedule, conducts sessions, writes notes |
| **Admin** | Manages users, platform settings, reports |

### Core Features
- **Session Booking** — Students book counseling sessions
- **Real-time Chat** — WebSocket-based counseling chat
- **Counselor Matching** — Match students to counselors
- **Resource Library** — Mental health articles/guides
- **Crisis Detection** — Flag urgent messages

## HIPAA & Privacy Rules (CRITICAL)

1. Never log message content in plain text
2. All PII (name, email, phone) must be encrypted at rest
3. Session data must have TTL/auto-delete policies
4. Access control: users can only see their own data
5. Audit log for counselor access to student records

## Session Types
| Type | Duration | Description |
|------|----------|-------------|
| Video | 50 min | Live video counseling |
| Chat | 50 min | Real-time text counseling |
| Phone | 30 min | Phone call counseling |

## Counselor Matching Logic
- Availability matching (schedule overlap)
- Specialty matching (anxiety, depression, etc.)
- Language preference
- Gender preference (optional)
- Emergency/crisis routing to senior counselor

## Testing Requirements
- All WebSocket handlers must have connection/disconnection tests
- Time-sensitive features (booking, crisis) must have timeout tests
- Auth middleware: test expired, invalid, missing tokens
- Rate limiting on chat endpoints

## Crisis Detection Rules
- Keywords that trigger alerts: "suicide", "self-harm", "kill myself"
- If detected: notify senior counselor immediately, log timestamp
- Do NOT block or censor user messages — alert, don't prevent
