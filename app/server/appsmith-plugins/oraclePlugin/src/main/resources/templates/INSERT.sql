INSERT INTO users
  (name, gender, email)
VALUES
  (
    {{ nameInput.text }},
    {{ genderDropdown.selectedOptionValue }},
    {{ emailInput.text }}
<<<<<<< HEAD:app/server/appsmith-plugins/oraclePlugin/src/main/resources/templates/CREATE.sql
  );
=======
  )
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f:app/server/appsmith-plugins/oraclePlugin/src/main/resources/templates/INSERT.sql
