# E-Concrete Manipulatives
> A customisable and interactive tool for teaching children about number bases.

Designed to be easy and engaging for children to use, E-Concrete-Manipulatives is a browser based program where users can create, move, select, and bundle sticks into groups of a set amount. Its aim is to teach children about the concept of number bases and deepen their understanding of them. Can be used as an individual activity in the classroom, or as a tool for trainee teachers in their preparation. Built to be useful to a range of children, the number of sticks in a bundle can be increased or decreased to show different number bases. Can be run locally using a development server, or accessed through the live site http://e-concrete-manipulatives.surge.sh/
![](screenshot.png)
![](beaver.mov)

## Getting Started
### Prerequisties 
nodeJS:
https://nodejs.org/en/download/

### Installing
Clone repository and cd into directory. \
Install the required packages using npm:
```
npm install
```
Run the server on local machine:
```
npm run dev
```
The site will be running at http://localhost:3000/.

### Live Site
Alternatively, if you just want to use the application, it is live at
http://e-concrete-manipulatives.surge.sh/

# How it works
NodeJS is used to run NPM to manage dependencies.
The app is bundled using Vite and Vite's development server is used for local testing with hot-loading whenever a change is made

## Running Tests
Unit tests can be run with the command
```
npm run test
```

## Deployment
Deployment is done using Surge, and is integrated into the CI/CD pipeline.
Whenever changes are merged / pushed to branch deployment, surge is used to update the live site.

## Usage
For examples and usage please refer to the Wiki.

## Authors / Contact
- Jake Lawrence 2469097L@student.gla.ac.uk
- Ada Fuge 2440986F@student.gla.ac.uk
- Claire Williamson 2464406W@student.gla.ac.uk
- Mahnoor Qureshi 2454285Q@student.gla.ac.uk
- Tanisha Sarkar 2424417S@student.gla.ac.uk


## License
This project is licensed under the GNU General Public License v3.0 - see `LICENSE.md` file for details.
