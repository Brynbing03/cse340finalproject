export const divisions = [
    { id: 1, name: "Women’s Doubles", color: "smash" },
    { id: 2, name: "Men’s Doubles", color: "match" },
    { id: 3, name: "Mixed Doubles", color: "double" }
  ];
  
  export const teams = [
    { id: 1, divisionId: 1, name: "Pickle Queens" },
    { id: 2, divisionId: 1, name: "Dink Girls" },
    { id: 3, divisionId: 2, name: "Court Kingz" },
    { id: 4, divisionId: 2, name: "Smash Bro Yo" },
    { id: 5, divisionId: 3, name: "Mixed Magic" },
    { id: 6, divisionId: 3, name: "Doubles Trouble" }
  ];
  
  export const matches = [
    { id: 101, divisionId: 3, teamA: "Mixed Magic", teamB: "Doubles Trouble", status: "requested" },
    { id: 102, divisionId: 2, teamA: "Court Kingz", teamB: "Smash Bro Yo", status: "scheduled" }
  ];