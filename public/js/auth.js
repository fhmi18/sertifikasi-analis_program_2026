/**
 * JWT token decoder and user role checker utility
 */

// Decode JWT token and extract user data
function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Get current user role from token
function getUserRole() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded ? decoded.role : null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

// Get current user ID from token
function getUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded ? decoded.userId : null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

// Check if user has specific role
function hasRole(role) {
  const userRole = getUserRole();
  return userRole === role;
}

// Check if user has any of the specified roles
function hasAnyRole(...roles) {
  const userRole = getUserRole();
  return roles.includes(userRole);
}

// Check if user can create/update/delete items (PETUGAS_INVENTARIS or ADMIN)
function canManageItems() {
  return hasAnyRole("PETUGAS_INVENTARIS", "ADMIN");
}

// Check if user can manage users (ADMIN only)
function canManageUsers() {
  return hasRole("ADMIN");
}

// Check if user can approve/reject loans (PETUGAS_INVENTARIS or ADMIN)
function canApproveLoans() {
  return hasAnyRole("PETUGAS_INVENTARIS", "ADMIN");
}

// Check if user can view reports
function canViewReports() {
  return hasAnyRole("PETUGAS_INVENTARIS", "ADMIN");
}

// Show error message with retry or redirect option
function showAuthError(message, redirectUrl = "/login") {
  // Remove any existing error modal first
  const existingModal = document.querySelector(".auth-error-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className =
    "auth-error-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const content = document.createElement("div");
  content.className = "bg-white rounded-lg p-6 w-96 shadow-xl";
  content.innerHTML = `
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Akses Ditolak</h3>
    <p class="text-gray-600 mb-6">${message}</p>
    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
      ${redirectUrl === "/login" ? "Kembali ke Login" : "Kembali"}
    </button>
  `;

  errorDiv.appendChild(content);

  // Click handler for button
  content.querySelector("button").addEventListener("click", () => {
    errorDiv.remove();
    window.location.href = redirectUrl;
  });

  // Click handler for backdrop - close modal without redirect
  errorDiv.addEventListener("click", (e) => {
    if (e.target === errorDiv) {
      errorDiv.remove();
    }
  });

  document.body.appendChild(errorDiv);

  // Auto-redirect after 3 seconds
  setTimeout(() => {
    if (document.querySelector(".auth-error-modal")) {
      window.location.href = redirectUrl;
    }
  }, 3000);
}

// Handle 403 Forbidden error from API
function handleForbiddenError(error) {
  console.warn("Access denied:", error);
  showAuthError(
    "Anda tidak memiliki izin untuk mengakses resource ini. Hubungi administrator jika Anda yakin ini adalah kesalahan.",
    "/",
  );
}
