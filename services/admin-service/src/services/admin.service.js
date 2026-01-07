/*
 Return the developers team members as required by the project specification.
 The reply must include only first_name and last_name for each team member.
*/
export function getDevelopersTeam() {
    // Return a static list of team members (no extra fields allowed)
    return [
        { first_name: "Chen", last_name: "Tetroashvili" },
        { first_name: "Itay David", last_name: "Zana"},
        { first_name: "Tomer", last_name: "Golan" }
    ];
}
