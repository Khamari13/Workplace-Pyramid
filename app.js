const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

load();

async function load() {
    try {
        const employees = [];

        // prompt manager
        const { name, id, email, officeNumber } = await promptManager();
        // place manager into empty array
        employees.push(new Manager(name, id, email, officeNumber));

        // prompt staff members
        const response = await promptStaffMembers();
        employees.push(...response);

        // generate and return a block of HTML
        const staff = await render(employees);
        console.log(staff);

        fs.writeFile(outputPath, staff, function(err) {
            if(err) {
                console.log(err);
            }
            
            console.log("staff.html has been created")
        });
    } catch (err) {
        console.log(err);
    }
}

// get info from inquirer about staff members
function promptManager() {
    return inquirer
        .prompt([
            {
                type: "input",
                message: "Enter manager's name:",
                name: "name"
            },
            {
                type: "number",
                message: "Enter the manager's ID:",
                name: "id"
            },
            {
                type: "input",
                message: "Enter the manager's email:",
                name: "email"
            },
            {
                type: "number",
                message: "Enter the manager's office number:",
                name: "officeNumber"
            }
        
        ])
}
// prompt for tyoe of staff member
const staffMembers = [];
async function promptStaffMembers() {
    try {
        const { role } = await promptMemberRole();
        if (role === "Engineer") {
            return inquirer
                .prompt([
                    {
                        type: "input",
                        message: "Enter engineer's name:",
                        name: "name"
                    },
                    {
                        type: "number",
                        message: "Enter the engineer's ID:",
                        name: "id"
                    },
                    {
                        type: "input",
                        message: "Enter the engineer's email:",
                        name: "email"
                    },
                    {
                        type: "input",
                        message: "Enter the engineer's github username:",
                        name: "github"
                    }
                ]).then(function ({ name, id, email, github }) {
                    staffMembers.push(new Engineer(name, id, email, github));
                    return promptStaffMembers();
                })
        } else if (role === "Intern") {
            return inquirer
                .prompt([
                    {
                        type: "input",
                        message: "Enter intern's name:",
                        name: "name"
                    },
                    {
                        type: "number",
                        message: "Enter the intern's ID:",
                        name: "id"
                    },
                    {
                        type: "input",
                        message: "Enter the intern's email:",
                        name: "email"
                    },
                    {
                        type: "input",
                        message: "Enter the intern's school:",
                        name: "school"
                    }
                ]).then(function({ name, id, email, school }) {
                    staffMembers.push(new Intern(name, id, email, school));
                    return promptStaffMembers();
                })
        } else {
            fs.writeFile(outputPath, staffMembers, function(err) {
                if(err) {
                    console.log(err);
                }
                console.log("staff.html has been created")
            });
            return staffMembers;
        }
    } catch (err) {
        console.log(err);
    }
}

// prompt for member role
function promptMemberRole() {
    return inquirer
        .prompt({
            type: "list",
            message: "What type of staff member would you like to add next?",
            name: "role",
            choices: [
                "Engineer",
                "Intern",
                "No more members to add"
            ]
        })
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
