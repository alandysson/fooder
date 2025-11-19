import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFornecedor, updateFornecedor } from "@/api/endpoints/fornecedores";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  phone: z.string().min(10, "Telefone inválido").max(15),
  email: z.string().email("E-mail inválido").max(100),
});

interface FornecedorFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function FornecedorForm({ onSuccess, initialData }: FornecedorFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          phone: initialData.phone,
          email: initialData.email,
        }
      : {
          name: "",
          phone: "",
          email: "",
        },
  });

  const queryClient = useQueryClient();

  const mutationEdit = useMutation({
    mutationFn: updateFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Fornecedor atualizado!",
        description: "O fornecedor foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar fornecedor",
        description: "Ocorreu um erro ao tentar atualizar o fornecedor.",
        variant: "destructive",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: createFornecedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast({
        title: "Fornecedor adicionado!",
        description: "O fornecedor foi adicionado com sucesso ao estoque.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar fornecedor",
        description: "Ocorreu um erro ao tentar adicionar o fornecedor.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      mutationEdit.mutate({ ...values, id: initialData.id });
    } else {
      mutation.mutate(values);
    }
    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Fornecedor</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Hortifruti São João" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@fornecedor.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="w-full bg-gradient-primary">
            {initialData ? "Salvar Alterações" : "Adicionar Fornecedor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
