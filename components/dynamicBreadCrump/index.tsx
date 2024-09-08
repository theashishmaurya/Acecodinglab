"use client";

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(segment => segment !== "");

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
      <BreadcrumbItem key={href}>
        {!isLast ? (
          <>
            <BreadcrumbLink asChild>
              <Link href={href}>{label}</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </>
        ) : (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathSegments.length > 0}
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;