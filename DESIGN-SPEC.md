# Science Lab — Design & Product Specification

## Screen 01: Home / Portal Selection

Status: Initial implementation committed. This is the first screen only. Do not design or implement additional screens until the owner approves the home screen implementation.

### Brand
- Product name: **Science Lab** (do not use a teacher's personal name in the site branding; it may be shared with other kindergarten teachers).
- Tagline: **Explore • Experiment • Discover • Learn**
- Style: bright, playful, cartoon classroom laboratory; colorful rounded panels; outlined bubble typography; cheerful science props; books, plants, stars and classroom windows.
- Character representation: intentionally varied racial backgrounds across illustrations. Do not depict only Black children or only one racial group. Teacher card should use a cartoon teacher; student card should show a diverse group of cartoon students.
- Responsive for classroom desktop, projector, and student iPads.

### Home screen content
- No unit cards on this screen. Unit and lesson browsing should happen after a student has chosen their class/name or a teacher has authenticated.
- Two large portal cards side-by-side on desktop and stacked on narrow screens:
  1. Pink **Teacher** card with cartoon teacher illustration. Support text: “Create · Assign · Grade · Manage”. Button: “Teacher Login”. Note: password-protected access.
  2. Blue **Student** card with a diverse group of cartoon students. Support text: “Choose your class and name to open your science activities”. Button: “Student Portal”.
- Background: bright cartoon science classroom with shelving, science books, plants, windows, small science-themed decorations, and rug. Keep visual focus on the two portals.
- Avoid using “Ms. Hill” or any personal teacher name in the brand/logo.

### Behavior and security requirements
- Teacher portal must use secure authenticated access. The gradebook, student scores, roster management, and teacher controls are private to the authenticated teacher/authorized educator, never visible in student access.
- Student entry path: click Student, select class, then select name. A name selector alone is not authentication; enforce assignment and submission permissions on the server/backend.
- Assignments are locked by default. Only assignments explicitly unlocked by the teacher should be accessible. Enforce unlock/lock state server-side; hiding a link in UI is insufficient.
- Grades must be stored in a secure shared database, not only local browser storage. Confirm district approval before adding real student names or results.
- Gradebook stores points earned, points possible, computed percentage, assignment, lesson, unit, attempt/submission state, and submission timestamp. For example, 11/14 = 78.571...%; preserve raw points and configure display rounding later.
- The Science Lab gradebook is a private teacher reference/export tool, not a replacement for the district's official gradebook. Support CSV export for manual transfer.
- Activities and lessons can be added continuously throughout the year; do not hard-limit the number of lessons or activities.

### Initial year structure
Use the uploaded Dallas ISD Kindergarten Science YAG as the initial 10-unit organization. It is a starting catalog, not a limit on teacher-created content:
1. Properties of Matter — K.6A
2. Force and Motion — K.7A
3. Energy — K.8AB
4. Earth's Materials — K.10A
5. Natural Resources — K.11A
6. Objects and Patterns in the Sky — K.9AB
7. Weather and Air — K.10BC
8. Environments — K.12A–B (continues across quarters)
9. Structures of Organisms — K.13AB
10. Life Cycles — K.13CD

### Screen-by-screen workflow
- Design, build, and review one screen at a time.
- Keep approved specifications in this file and update them when the owner approves a change.
- Do not proceed to the next screen until the owner confirms the current screen.
- Planned next screens (not yet designed/implemented): secure Teacher Login; Student Class Selection; Student Name Selection; Teacher Dashboard; Unit/Lesson Library; Activity/Quiz Builder; Assignment Management with teacher-only unlock; Private Gradebook; Settings/Roster Management.

### Implementation note
The current `index.html` is an initial home screen prototype. Its Teacher/Student buttons only display placeholder messaging for future screens. Authentication, class selection, assignments, database persistence, gradebook, and deployment are not yet implemented. Never describe those features as working until implemented and tested.
