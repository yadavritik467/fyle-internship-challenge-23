## git-user-search - Explore GitHub

git-user-search is a web application built with Angular, designed to help users explore GitHub repositories with ease. With git-user-search, users can search for repositories, view details of individual repositories.

# Live URL

https://fyle-internship-challenge-23-dusky-nu.vercel.app/

## Assignment Details

I have implemented this assignment using the Angular framework only, as instructed. Additionally, I forked the provided repository and worked on my assignment within the forked repository only. I have also written test case for 1 service and 1 component. Along with this I have implemented skeleton loader, GET API caching etc as per the instruction.

## Features

- **Search Users**: Easily search for public github profiles by entering keywords or phrases.
- **Search Repositories**: Easily search for repositories by entering keywords or phrases.
- **View Repository Details**: Get detailed information about each repository, including the owner, description, name,and more.
- **User-Friendly Interface**: Intuitive and responsive user interface for seamless navigation and interaction.

## How to use this software

- When you open this page (https://fyle-internship-challenge-23-dusky-nu.vercel.app/) so you are on user listing page. Here you can search for any user name.
- Then click on any user for which you want to see repos. When you click so you are redirected to repos listing page of that user. Here you can search any public repos keyword. Also from top search bar you can directly change username also.

## Technologies Used

- **Angular**: Frontend framework used for building the application.
- **GitHub API**: Integration with the GitHub API to fetch repository data.
- **HTML/CSS/JavaScript**: Standard web technologies for structuring, styling, and scripting the application.
- **Tailwind CSS**: Used Tailwind css for modern stylling
- **Angukar Material ui**: Used angular material for modern appealing UI

## I have written Test Case for

Service - services/api/api.service.ts
interceptor - reduntant-api-call.interceptor.ts
component - home.component.ts,search-repo.component.ts,sckeleton-loader.component.ts,app.component.ts,

## Installation

To run git-user-search locally, follow these steps:

1. Clone the git-user-search repository to your local machine.
   git clone https://github.com/yadavritik467/fyle-internship-challenge-23.git

2. Navigate to the project directory.
   cd fyle-internship-challenge-23

3. Install dependencies using npm.
   npm install

4. Setup env file

- update your github token if you change mode to production on environments/evironment.sample.ts file on the varible github_token=''

5. Start the development server.
   npm start

6. Open your web browser and visit `http://localhost:4200` to view the application.

## Contributing

Contributions to git-user-search are welcome! If you would like to contribute to the project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository's `develop` branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions regarding git-user-search, feel free to contact me yadavritik467@gmail.com

Happy Exploring GitHub with git-user-search! 🚀
