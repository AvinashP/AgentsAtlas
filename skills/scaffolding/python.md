# Python Templates

Templates for Python modules and applications. Match to your project's conventions.

## Module with Class

```python
"""
Module description.

This module provides [functionality].
"""

from dataclasses import dataclass
from typing import Optional, List


@dataclass
class Item:
    """Represents an item in the system."""

    id: str
    name: str
    description: Optional[str] = None


class ItemService:
    """Service for managing items."""

    def __init__(self, repository: "ItemRepository"):
        self._repository = repository

    def get_all(self) -> List[Item]:
        """Get all items."""
        return self._repository.find_all()

    def get_by_id(self, item_id: str) -> Optional[Item]:
        """Get an item by ID."""
        return self._repository.find_by_id(item_id)

    def create(self, name: str, description: Optional[str] = None) -> Item:
        """Create a new item."""
        item = Item(
            id=self._generate_id(),
            name=name,
            description=description,
        )
        self._repository.save(item)
        return item

    def update(self, item_id: str, **kwargs) -> Optional[Item]:
        """Update an existing item."""
        item = self._repository.find_by_id(item_id)
        if not item:
            return None

        for key, value in kwargs.items():
            if hasattr(item, key):
                setattr(item, key, value)

        self._repository.save(item)
        return item

    def delete(self, item_id: str) -> bool:
        """Delete an item."""
        return self._repository.delete(item_id)

    def _generate_id(self) -> str:
        import uuid
        return str(uuid.uuid4())
```

---

## FastAPI Router

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/items", tags=["items"])


class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ItemResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ItemResponse])
async def list_items(
    skip: int = 0,
    limit: int = 100,
    service: ItemService = Depends(get_item_service),
):
    """Get all items."""
    return service.get_all()[skip : skip + limit]


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: str,
    service: ItemService = Depends(get_item_service),
):
    """Get an item by ID."""
    item = service.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemResponse, status_code=201)
async def create_item(
    data: ItemCreate,
    service: ItemService = Depends(get_item_service),
):
    """Create a new item."""
    return service.create(name=data.name, description=data.description)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: str,
    data: ItemUpdate,
    service: ItemService = Depends(get_item_service),
):
    """Update an item."""
    item = service.update(item_id, **data.model_dump(exclude_unset=True))
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=204)
async def delete_item(
    item_id: str,
    service: ItemService = Depends(get_item_service),
):
    """Delete an item."""
    if not service.delete(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
```

---

## Flask Blueprint

```python
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import NotFound

items_bp = Blueprint("items", __name__, url_prefix="/api/items")


@items_bp.route("/", methods=["GET"])
def list_items():
    """Get all items."""
    items = ItemService.get_all()
    return jsonify([item.to_dict() for item in items])


@items_bp.route("/<item_id>", methods=["GET"])
def get_item(item_id: str):
    """Get an item by ID."""
    item = ItemService.get_by_id(item_id)
    if not item:
        raise NotFound("Item not found")
    return jsonify(item.to_dict())


@items_bp.route("/", methods=["POST"])
def create_item():
    """Create a new item."""
    data = request.get_json()
    item = ItemService.create(
        name=data["name"],
        description=data.get("description"),
    )
    return jsonify(item.to_dict()), 201


@items_bp.route("/<item_id>", methods=["PUT"])
def update_item(item_id: str):
    """Update an item."""
    data = request.get_json()
    item = ItemService.update(item_id, **data)
    if not item:
        raise NotFound("Item not found")
    return jsonify(item.to_dict())


@items_bp.route("/<item_id>", methods=["DELETE"])
def delete_item(item_id: str):
    """Delete an item."""
    if not ItemService.delete(item_id):
        raise NotFound("Item not found")
    return "", 204
```

---

## SQLAlchemy Model

```python
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from .database import Base


class Status(enum.Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"


class Item(Base):
    __tablename__ = "items"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(Status), default=Status.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="items")

    def __repr__(self):
        return f"<Item {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
```

---

## Pydantic Model

```python
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, validator


class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class ItemInDB(ItemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ItemResponse(ItemInDB):
    @validator("created_at", "updated_at", pre=True)
    def format_datetime(cls, v):
        if isinstance(v, datetime):
            return v.isoformat()
        return v
```

---

## Test File (Pytest)

```python
import pytest
from unittest.mock import Mock, patch

from mymodule.services import ItemService
from mymodule.models import Item


@pytest.fixture
def mock_repository():
    return Mock()


@pytest.fixture
def service(mock_repository):
    return ItemService(repository=mock_repository)


@pytest.fixture
def sample_item():
    return Item(id="123", name="Test Item", description="Test description")


class TestItemService:
    def test_get_all_returns_items(self, service, mock_repository, sample_item):
        mock_repository.find_all.return_value = [sample_item]

        result = service.get_all()

        assert len(result) == 1
        assert result[0].name == "Test Item"
        mock_repository.find_all.assert_called_once()

    def test_get_by_id_returns_item(self, service, mock_repository, sample_item):
        mock_repository.find_by_id.return_value = sample_item

        result = service.get_by_id("123")

        assert result is not None
        assert result.name == "Test Item"
        mock_repository.find_by_id.assert_called_once_with("123")

    def test_get_by_id_returns_none_when_not_found(self, service, mock_repository):
        mock_repository.find_by_id.return_value = None

        result = service.get_by_id("nonexistent")

        assert result is None

    def test_create_saves_and_returns_item(self, service, mock_repository):
        result = service.create(name="New Item", description="Description")

        assert result.name == "New Item"
        assert result.description == "Description"
        mock_repository.save.assert_called_once()

    def test_delete_returns_true_on_success(self, service, mock_repository):
        mock_repository.delete.return_value = True

        result = service.delete("123")

        assert result is True
        mock_repository.delete.assert_called_once_with("123")


class TestItemServiceIntegration:
    @pytest.fixture
    def db_session(self):
        """Create a test database session."""
        # Setup test database
        yield session
        # Cleanup

    def test_full_crud_workflow(self, db_session):
        service = ItemService(repository=ItemRepository(db_session))

        # Create
        item = service.create(name="Integration Test")
        assert item.id is not None

        # Read
        fetched = service.get_by_id(item.id)
        assert fetched.name == "Integration Test"

        # Update
        updated = service.update(item.id, name="Updated Name")
        assert updated.name == "Updated Name"

        # Delete
        assert service.delete(item.id) is True
        assert service.get_by_id(item.id) is None
```

---

## CLI Script (Click)

```python
#!/usr/bin/env python3
"""CLI tool for managing items."""

import click


@click.group()
@click.version_option()
def cli():
    """Item management CLI tool."""
    pass


@cli.command()
@click.option("--name", "-n", required=True, help="Project name")
@click.option("--path", "-p", default=".", help="Output path")
def init(name: str, path: str):
    """Initialize a new project."""
    click.echo(f"Initializing project '{name}' at {path}")
    # Implementation


@cli.command()
@click.argument("item_type")
@click.option("--output", "-o", default=".", help="Output directory")
def generate(item_type: str, output: str):
    """Generate a new resource."""
    click.echo(f"Generating {item_type} at {output}")
    # Implementation


@cli.command()
@click.option("--verbose", "-v", is_flag=True, help="Verbose output")
def list(verbose: bool):
    """List all items."""
    items = ItemService.get_all()
    for item in items:
        if verbose:
            click.echo(f"{item.id}: {item.name} - {item.description}")
        else:
            click.echo(f"{item.name}")


if __name__ == "__main__":
    cli()
```

---

## Conftest (Pytest Fixtures)

```python
"""Shared pytest fixtures."""

import pytest
from unittest.mock import Mock


@pytest.fixture
def mock_db():
    """Mock database session."""
    return Mock()


@pytest.fixture
def mock_client(app):
    """Test client for Flask/FastAPI."""
    return app.test_client()


@pytest.fixture(autouse=True)
def reset_mocks(mock_db):
    """Reset mocks after each test."""
    yield
    mock_db.reset_mock()


@pytest.fixture
def auth_headers():
    """Authentication headers for API tests."""
    return {"Authorization": "Bearer test-token"}


@pytest.fixture
def sample_data():
    """Sample test data."""
    return {
        "item": {"name": "Test Item", "description": "Test description"},
        "user": {"email": "test@example.com", "name": "Test User"},
    }
```
