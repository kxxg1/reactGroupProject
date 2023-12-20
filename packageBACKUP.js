let old = {
    "name": "react_todo_app",
    "version": "0.1.0",
    "homepage": "https://TjhaiME.github.io/reactGroupProjectBuild",
    "private": true,
    "dependencies": {
      "@testing-library/jest-dom": "^5.17.0",
      "@testing-library/react": "^13.4.0",
      "@testing-library/user-event": "^13.5.0",
      "date-fns": "^2.30.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "^5.0.1",
      "web-vitals": "^2.1.4"
    },
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d build",
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
    "devDependencies": {
      "gh-pages": "^6.1.0"
    }
  }
  