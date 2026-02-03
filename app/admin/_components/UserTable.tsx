"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserTable(
{ users, pagination, search }: 
{ users: any[]; pagination: any; search: string }
) {
    const router = useRouter();

    return (
        <div>
            <table className="table border">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {pagination && (
                    <>
                        {pagination.page > 1 && (
                            <Link
                                href={`/admin/users?page=${pagination.page - 1}&size=${pagination.size}&search=${search}`}
                            >
                                Previous
                            </Link>
                        )}

                        <span>
                            {" "}
                            Page {pagination.page} of {pagination.totalPages}{" "}
                        </span>

                        {pagination.page < pagination.totalPages && (
                            <Link
                                href={`/admin/users?page=${pagination.page + 1}&size=${pagination.size}&search=${search}`}
                            >
                                Next
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
