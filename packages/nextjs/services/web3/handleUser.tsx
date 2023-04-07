interface User {
  _id: string;
  address: string;
}

const handleUser = async function (walletAddress: string): Promise<User> {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: walletAddress }),
  });
  const user = await response.json();
  if (response.ok) {
    return { _id: user._id, address: user.address };
  } else {
    throw new Error(`Failed to create/get user: ${user}`);
  }
};

export default handleUser;
