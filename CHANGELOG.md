# Changelog

All notable changes to this project will be documented in this file.

## [0.11.0] - 2026-02-21

### Added
- **Analytics View:** Added a dedicated 'Stats' view with interactive line charts to track 1RM and Volume progress per-exercise.
- **Premium Micro-Interactions:** Implemented `framer-motion` spring animations across all core UI components.
- **Haptic Feedback:** Integrated the Web Vibration API for tactile feedback during interactions.
- **Toast Notifications:** Added a modern, globally positioned Toast overlay, replacing native browser alerts for a sleeker experience.
- **Template Management:** Added the ability to delete saved templates from the Logger view, and refined template naming rules.

## [0.10.0] - 2026-02-21

### Added
- **1RM Calculator:** Added a dedicated 1-Rep Max calculator widget in the Tools tab using the Epley formula.
- **Bodyweight & Unilateral Toggles:** Added new toggles in the Logger view to flag exercises as bodyweight-only or unilateral (per side).
- **Accurate Volume Tracking:** Unilateral exercises now automatically double their volume calculation when saving.
- **Improved UI Legibility:** Bodyweight-only exercises now intelligently replace "0 lbs" with "BW" across the Logger and History views.

## [0.9.0] - 2026-02-21

### Added
- **Workout Templates:** Save completed workouts as templates to easily pre-populate future sessions in the Logger.
- **PR Tracking:** Every logged set is now evaluated to determine the estimated 1-Rep Max (1RM). Sets that break previous records for that exercise get a gold "PR" badge in the History tab.
- **Ghost Stats:** When loading a template, the Logger pre-fills inputs with placeholders of the weight and reps from the original session to guide the user.

## [0.8.0] - 2026-02-21

### Added
- **Custom Exercises:** Users can now add, edit, and delete their own custom exercises.
- **Custom Muscle Groups:** Added support for dynamically creating custom muscle groups.
- **Dynamic Color Generation:** Custom muscle groups automatically generate unique, aesthetic pastel colors based on their names.
- **Data Backup System:** Added JSON Import and Export capabilities in Settings to prevent data loss across devices.
- **Advanced Muscle Targeting:** "Arms" category has been split into specific "Biceps", "Triceps", and "Forearms" groups for more granular tracking.
- **Settings UI Enhancements:** Added dedicated "Data Management" and "Custom Exercises" sections in the Settings view to manage the new features.

### Changed
- "Arms" has been replaced in the default muscle group list and pre-compiled exercises with "Biceps", "Triceps", and "Forearms".
- "Data Management" icon in Settings updated to match the "Total Lifts" semantic color (rose).

### Fixed
- Fixed an issue where new custom muscle groups would require a page refresh before appearing in the Logger workout flow by properly lifting state.
