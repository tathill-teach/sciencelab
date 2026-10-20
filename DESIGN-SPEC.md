# Science Lab — Design & Product Specification

## Screen 01: Home / Portal Selection

Status: Initial implementation committed. Approved visual direction; review the live HTML prototype before calling it complete.

### Brand
- Product name: **Science Lab** (no personal teacher name in the brand; it may be shared with other kindergarten teachers).
- Tagline: **Explore • Experiment • Discover • Learn**
- Style: bright, playful cartoon classroom laboratory; colorful rounded panels; outlined bubble typography; science props, books, plants, stars and classroom windows.
- Character representation: intentionally varied racial backgrounds across illustrations. Do not depict only Black children or only one racial group. Teacher card has a cartoon teacher; student card has a diverse group of cartoon students.
- Responsive for classroom desktop, projector, and student iPads.

### Home screen content
- No unit cards on the home screen. Unit and lesson browsing happens after a student has selected class/name or a teacher has authenticated.
- Two portal cards side-by-side on desktop and stacked on narrow screens:
  1. Pink **Teacher** card with cartoon teacher. Support text: “Create · Assign · Grade · Manage”. Button: “Teacher Login”. Password-protected access.
  2. Blue **Student** card with diverse cartoon students. Support text: “Choose your class and name to open your science activities”. Button: “Student Portal”.
- Classroom background with shelves, books, plants, windows, and small science decorations. Keep visual focus on portals.
- Current implementation uses the exact uploaded full-page artwork at `Ms. Hill’s Colorful Science Lab.png` as the home-screen background, rather than recreating its characters with emoji or substitute SVGs. The Teacher card navigates to `teacher-login.html`. The Student button is disabled until its class-selection screen is implemented; it no longer shows a placeholder popup.

## Screen 02: Teacher Login

Status: Approved design choices and prototype committed. Authentication is not connected yet.

### Approved appearance
- Same bright, colorful cartoon classroom style as home screen.
- Science Lab logo and tagline at top.
- Purple **Back to Home** button at top-left, linking back to `index.html`.
- Cartoon teacher illustration with classroom desk/books/supplies.
- Large pink rounded Teacher Login panel.
- Intro text: “Enter your password to access lessons, assignments, grades, and more!”
- Password field includes an eye toggle to show/hide the entered password.
- Prominent pink **Sign In** button.
- Incorrect/unavailable sign-in feedback should appear as a pop-up modal.
- Friendly, playful classroom details, responsive layout, and accessible labels/focus states.
- Current implementation: `teacher-login.html`. Its form currently opens an explanatory placeholder modal because secure authentication has not yet been configured. It does not validate a real password.

## Product and security requirements
- Teacher portal must use secure authenticated access. Gradebook, scores, roster management, and teacher controls are private to authenticated/authorized teacher accounts and never visible in student access.
- Do not store a real teacher password in client-side HTML or JavaScript.
- Student entry: click Student, select class, then select name. Name selection alone is not authentication; enforce assignment/submission permissions on the server/backend.
- Assignments are locked by default. Only assignments explicitly unlocked by the teacher should be accessible. Enforce lock state server-side; hiding a link in the UI is insufficient.
- Grades stored in a secure shared database, not only browser storage. Confirm district approval before adding real student names or results.
- Gradebook stores points earned, points possible, computed percentage, assignment, lesson, unit, attempt/submission state, and submission timestamp. Example: 11/14 = 78.571...%; preserve raw points and configure display rounding later.
- Science Lab is a private teacher reference/export tool, not a replacement for the district's official gradebook. Support CSV export for manual transfer.
- Allow teachers to add lessons and activities throughout the year without a fixed low limit.

## Initial year structure
Use the uploaded Dallas ISD Kindergarten Science YAG as the initial 10-unit organization, not a limit on teacher-created content:
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

## Screen-by-screen workflow
- Design, build, and review one screen at a time.
- Keep approved specifications here and update them when the owner approves changes.
- Do not proceed to the next screen until the owner confirms the current screen.
- Planned screens after Teacher Login: Student Class Selection; Student Name Selection; Teacher Dashboard; Unit/Lesson Library; Activity/Quiz Builder; Assignment Management with teacher-only unlock; Private Gradebook; Settings/Roster Management.

## Shared frontend files
- `styles.css`: shared visual styles for both screens. It currently combines the style rules extracted from the initial page prototypes; before the full site is deployed, refine any page-specific CSS conflicts and test both screens at desktop and tablet sizes.
- `script.js`: shared, guarded interactions for both pages. It initializes only controls present on the current page.
- `index.html` and `teacher-login.html` reference the shared stylesheet and script rather than embedding their own blocks.

## Implementation note
Current `index.html` and `teacher-login.html` are prototypes. Authentication, class selection, assignment unlock enforcement, database persistence, gradebook, and deployment are not yet implemented. Never describe those features as working until implemented and tested.

## Screen 02 final-artwork update (2026-10-20)
- Uploaded source art: `Science Lab Teacher Login.png`.
- `teacher-login.html` displays this exact full-page image, not a recreated SVG or layout.
- `styles.css` positions transparent interactive regions over Back to Home, password input, show/hide control, and Sign In.
- `script.js` toggles password visibility and opens popup feedback on form submit.
- Authentication remains a placeholder: the popup explicitly explains that secure sign-in isn't configured yet. Do not treat this form as real login.

## Teacher accounts and class separation
- The Teacher Login page needs a visible show/hide password control.
- Plan for multi-teacher use: each teacher must authenticate with their own account and only access the classes, assignments, and grade records assigned to that teacher.
- Tatiyana's class is the only current class, but the data model should support additional teachers/classes in the future.
- Do not implement separate teacher passwords as a front-end-only security feature. Enforce authentication and class-level authorization on a secure backend before storing real student grades.
- Current sign-in remains a prototype until secure authentication and authorization are implemented.

## Screen 03: Teacher Dashboard — approved visual design (2026-10-20)

Status: **Visual direction approved.** The colorful cartoon classroom theme is approved; the revised CSS implementation is committed as a frontend prototype. Layout and behavior remain a prototype, not a connected authenticated dashboard.

### Approved layout and art direction
- Top navigation tabs: Overview, Units & Lessons, Assignments, Gradebook, My Class, Settings.
- Compact welcome area and prominent “Add Lesson or Activity” action.
- Four summary cards: My Units, Lessons & Activities, Assignments, Gradebook.
- Units are organized into their own cards/rows. Each lesson/activity will be attached to a specific unit; assignments are associated with the relevant lesson and unit.
- Use glossy cartoon-style gradients, chunky dark outlines, stitched/dashed decorative details, bubble-like typography, bright pink/purple/blue/yellow/green panels, stars, science motifs, and a warm elementary classroom atmosphere to match the approved Home and Teacher Login artwork.
- Keep the exact approved Home and Teacher Login artwork and their existing styles unchanged.
- Starter units: Properties of Matter (K.6A), Force and Motion (K.7A), Energy (K.8AB), Earth's Materials (K.10A), Natural Resources (K.11A), Objects and Patterns in the Sky (K.9AB), Weather and Air (K.10BC), Environments (K.12A–B), Structures of Organisms (K.13AB), Life Cycles (K.13CD).

### Prototype limits and security
- Quick actions, unit creation, and unit detail buttons currently display prototype feedback; they do not create or persist curriculum data.
- Authentication, teacher-specific permissions, assignment locks, database persistence, and gradebook storage/export require secure backend implementation and testing.
- Do not store real student records until district approval and server-side access controls are in place.

### Files
- `teacher-dashboard.html`: dashboard layout and prototype interactions.
- `teacher-dashboard.css`: colorful cartoon-inspired dashboard-specific styles, isolated from Home/Login CSS.
- `DESIGN-SPEC.md`: approved dashboard layout, visual direction, unit organization, and security requirements.


### Dashboard artwork asset (2026-10-20)
- Owner added the approved full-page dashboard illustration: `Colorful Science Lab Teacher Dashboard.png`.
- Source: [Colorful Science Lab Teacher Dashboard.png](https://github.com/tathill-teach/sciencelab/blob/main/Colorful%20Science%20Lab%20Teacher%20Dashboard.png).
- Keep this image as the visual reference for dashboard styling. Do not automatically replace the interactive HTML layout with a single flat image; preserve functional navigation and unit/lesson structure unless the owner explicitly requests a full-image screen.
