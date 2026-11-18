
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):

    def create_user(self, email, nom, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire.")

        if not nom:
            raise ValueError("Le nom est obligatoire.")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            nom=nom,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, nom, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Un superuser doit avoir is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Un superuser doit avoir is_superuser=True.")

        return self.create_user(
            email=email,
            nom=nom,
            password=password,
            **extra_fields
        )


class User(AbstractUser):

    username = None

    nom = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    eco_score_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom"]

    objects = UserManager()

    def __str__(self):
        return self.nom
