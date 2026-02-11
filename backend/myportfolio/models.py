from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    bio_summary = models.TextField(blank=True)
    resume_link = models.URLField(blank=True)
    profile_picture = models.ImageField(
        upload_to='profiles/', blank=True, null=True
    )
    profile_picture_url = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.full_name



class Technology(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name='projects'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.ManyToManyField(Technology, related_name='projects')
    live_link = models.URLField(blank=True)
    github_link = models.URLField(blank=True)
    image = models.ImageField(
        upload_to='projects/', blank=True, null=True
    )
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title


class Skill(models.Model):
    LEVELS = [
        ('beg', 'Beginner'),
        ('int', 'Intermediate'),
        ('adv', 'Advanced'),
    ]

    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name='skills'
    )
    name = models.CharField(max_length=50)
    proficiency_level = models.CharField(
        max_length=3, choices=LEVELS
    )
    category = models.CharField(
        max_length=50, help_text="e.g., Frontend, Backend, DevOps"
    )
    certification_url = models.URLField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'name')
        ordering = ['category', '-proficiency_level']

    def __str__(self):
        return f"{self.name} ({self.get_proficiency_level_display()})"


class Experience(models.Model):
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name='experiences'
    )
    job_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    responsibilities = models.TextField()
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

class ContactMessage(models.Model):
    STATUS = [
        ('new', 'New'),
        ('progress', 'In progress'),
        ('responded', 'Responded'),
    ]

    sender_name = models.CharField(max_length=100)
    sender_email = models.EmailField()
    subject = models.CharField(max_length=200)
    message_content = models.TextField()
    received_date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    response_status = models.CharField(
        max_length=12, choices=STATUS, default='new'
    )
    response_text = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(
        null=True, blank=True
    )

    class Meta:
        ordering = ['-received_date']

    def __str__(self):
        return f"Message from {self.sender_name}"
